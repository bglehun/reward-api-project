import { BadRequestException, HttpException, Injectable, UseInterceptors } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { RewardRepository } from './repositories/reward.repository';
import { RewardHistoryRepository } from './repositories/reward-history.repository';
import { Reward } from './entities/reward.entity';
import { RewardHistory } from './entities/reward-history.entity';
import { getRewardListDto } from './dto/reward.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RewardService {
  constructor(
    private rewardRepository: RewardRepository,
    private rewardHistoryRepository: RewardHistoryRepository,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}


  async getRewardHistory(
    transactionManager: EntityManager,
    params: { userId: string, cursor: getRewardListDto }
  ): Promise<RewardHistory[]>  {
    const rewardHistory = await this.rewardHistoryRepository.getRewardHistoryWithPagination(transactionManager, {
      ...params,
      limit: Number(this.configService.get('PAGINATION_LIMIT')),
    })

    return rewardHistory;
  }

  async saveReward(transactionManager: EntityManager, params: { userId: string, saveReward: number, trId?: string }): Promise<Reward> {
    const { userId, saveReward, trId } = params;

    const rewardInfo: Reward = await this.rewardRepository.saveReward(transactionManager, { userId, saveReward });
    await this.rewardHistoryRepository.saveRewardHistory(transactionManager, { userId, saveReward, trId });

    return rewardInfo;
  }

  async useReward(transactionManager: EntityManager, params: { userId: string, useReward: number, trId?: string }): Promise<Reward> {
    const { userId, useReward, trId } = params;

    const rewardInfo: Reward = await this.rewardRepository.useReward(transactionManager, { userId, useReward });
    await this.rewardHistoryRepository.useRewardHistory(transactionManager, { userId, useReward, trId });

    return rewardInfo;
  }

  /** 적립금 만료의 경우, middleware가 interceptor보다 먼저 호출되기 때문에, transaction은 따로 구현 */
  async expireRewardInMiddleWare(params: { userId: string }): Promise<Reward> {
    const { userId } = params;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      let rewardInfo: Reward = await this.rewardRepository.getReward({ userId });

      if (rewardInfo && rewardInfo.remainReward > 0) {
        const expireReward = await this.rewardHistoryRepository.expireRewardHistory(queryRunner.manager, { userId });
        if (expireReward > 0) rewardInfo = await this.rewardRepository.expireReward(queryRunner.manager, { userId, expireReward })
      }

      await queryRunner.commitTransaction();
      return rewardInfo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
       throw new HttpException(err.message, err.getStatus());
    }
    finally {
      await queryRunner.release();
    }
  }
}
