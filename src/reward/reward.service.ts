import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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

  async getRewardHistory(params: { userId: string, cursor: getRewardListDto }): Promise<RewardHistory[]>  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      const rewardHistory = await this.rewardHistoryRepository.getRewardHistoryWithPagination(queryRunner.manager, {
        ...params,
        limit: Number(this.configService.get('PAGINATION_LIMIT')),
      })

      await queryRunner.commitTransaction();
      return rewardHistory;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return
  }

  async saveReward(params: { userId: string, saveReward: number, trId?: string }): Promise<Reward> {
    const { userId, saveReward, trId } = params;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      const rewardInfo: Reward = await this.rewardRepository.saveReward(queryRunner.manager, { userId, saveReward });
      await this.rewardHistoryRepository.saveRewardHistory(queryRunner.manager, { userId, saveReward, trId });

      await queryRunner.commitTransaction();
      return rewardInfo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async useReward(params: { userId: string, useReward: number, trId?: string }): Promise<Reward> {
    const { userId, useReward, trId } = params;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      const rewardInfo: Reward = await this.rewardRepository.useReward(queryRunner.manager, { userId, useReward });
      await this.rewardHistoryRepository.useRewardHistory(queryRunner.manager, { userId, useReward, trId });

      await queryRunner.commitTransaction();
      return rewardInfo;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    }
    finally {
      await queryRunner.release();
    }
  }

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
      throw new BadRequestException(err);
    }
    finally {
      await queryRunner.release();
    }
  }
}
