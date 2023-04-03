import { CustomRepository } from '../../typeorm/typeorm-custom.decorator';
import { Reward } from '../entities/reward.entity';
import { EntityManager, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@CustomRepository(Reward)
export class RewardRepository extends Repository<Reward> {
  private async createReward({ userId }): Promise<Reward> {
    const reward: Reward = new Reward();
    reward.userId = userId;
    return await this.save(reward);
  }

  async getReward({ userId }): Promise<Reward> {
    let reward: Reward = await this.findOneBy({ userId });

    /** 적립금 정보가 없으면 초기 정보 생성 */
    if (!reward) reward = await this.createReward({ userId })
    return reward;
  }

  async saveReward(
    transactionManager: EntityManager,
    { userId, saveReward },
  ): Promise<Reward> {
    let rewardInfo: Reward = await transactionManager.findOneBy(Reward, { userId })

    if (!rewardInfo) {
      /** save new reward info */
      const reward = new Reward();
      reward.userId = userId;
      reward.savedReward = saveReward;
      reward.remainReward = saveReward;

      rewardInfo = await transactionManager.save(reward);
    } else {
      /**
       *  update reward info
       *  increment value
       *  */
      await transactionManager.createQueryBuilder()
      .update(Reward)
      .where({ userId })
      .set({
        savedReward: () => 'savedReward + :saveReward',
        remainReward: () => 'remainReward + :saveReward'
      })
      .setParameter('saveReward', saveReward)
      .execute();

      /** return updated reward info */
      rewardInfo = await transactionManager.findOneBy(Reward, { userId });
    }
    return rewardInfo;
  }

  async useReward(
    transactionManager: EntityManager,
    { userId, useReward },
  ): Promise<Reward> {
    let rewardInfo: Reward = await transactionManager.findOneBy(Reward, { userId })

    if (!rewardInfo) {
      throw new BadRequestException('Not exists reward info.');
    } else if (rewardInfo.remainReward < useReward) {
      throw new BadRequestException('Not enough remainReward');
    } else {

      /**
       *  update reward info
       *  decrement value
       *  */
      await transactionManager.createQueryBuilder()
      .update(Reward)
      .where({ userId })
      .set({
        usedReward: () => 'usedReward + :useReward',
        remainReward: () => 'remainReward - :useReward'
      })
      .setParameter('useReward', useReward)
      .execute();

      /** return updated reward info */
      rewardInfo = await transactionManager.findOneBy(Reward, { userId });
    }
    return rewardInfo;
  }

  async expireReward(
    transactionManager: EntityManager,
    { userId, expireReward },
  ): Promise<Reward> {
    await transactionManager.createQueryBuilder()
    .update(Reward)
    .where({ userId })
    .set({
      expiredReward: () => 'expiredReward + :expireReward',
      remainReward: () => 'remainReward - :expireReward'
    })
    .setParameter('expireReward', expireReward)
    .execute();

    return await transactionManager.findOneBy(Reward, { userId });
  }
}
