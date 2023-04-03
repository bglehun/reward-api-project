import { CustomRepository } from '../../typeorm/typeorm-custom.decorator';
import { RewardHistory, RewardHistoryType } from '../entities/reward-history.entity';
import { EntityManager, Repository, LessThanOrEqual, MoreThan, } from 'typeorm';

@CustomRepository(RewardHistory)
export class RewardHistoryRepository extends Repository<RewardHistory> {
  private async getRewardHistoryForUse(
    transactionManager: EntityManager,
    { userId },
  ): Promise<RewardHistory[]> {
    const rewardHistory: RewardHistory[] = await transactionManager.find(RewardHistory, {
      where: {
        userId,
        remainReward: MoreThan(0),
      },
      order: { createdAt: 'asc' },
    });

    return rewardHistory;
  }

  private async getRewardHistoryForExpire(
    transactionManager: EntityManager,
    { userId },
  ): Promise<RewardHistory[]> {
    /** 호출 시점으로부터 1년 전 날짜 생성 */
    const now = new Date();
    const aYearAgo = new Date(now.setUTCFullYear(now.getFullYear() -1 ));

    const willExpireRewardHistory: RewardHistory[] = await transactionManager.find(RewardHistory, {
      where: {
        userId,
        createdAt: LessThanOrEqual(aYearAgo),
      },
    });

    return willExpireRewardHistory;
  }

  async getRewardHistoryWithPagination(
    transactionManager: EntityManager,
    { userId, cursor, limit = 10 }
  ): Promise<RewardHistory[]> {
    if (isNaN(cursor)) cursor = Number.MAX_SAFE_INTEGER;

    /** 커버링 인덱스를 사용하여 id 값 추출 */
    const subQuery = transactionManager.createQueryBuilder(RewardHistory, 'subquery').select('subquery.id').addSelect('subquery.userId').useIndex('idx_id_userId_expiredAt').where(`subquery.id < :cursor`).andWhere('subquery.userId = :userId').orderBy('subquery.id', 'DESC').limit(limit).getQuery();

    const rewardHistory = await transactionManager.createQueryBuilder(RewardHistory, 'main').innerJoin(
      `(${subQuery})`,
      'subTable',
      'main.id = subTable.`subquery_id` AND main.userId = subTable.`subquery_userId`'
    ).setParameter('userId', userId).setParameter('cursor', cursor).useIndex('idx_id_userId_expiredAt').getMany();

    /** mysql filesort를 방지하기 위해 로직에서 정렬 */
    return rewardHistory.sort((a, b) => b.id - a.id);
  }

  async saveRewardHistory(
    transactionManager: EntityManager,
    { userId, saveReward, trId }
  ) : Promise<any> {
    const rewardHistory = new RewardHistory();
    rewardHistory.userId = userId;
    rewardHistory.type = RewardHistoryType.SAVE;
    rewardHistory.reward = saveReward;
    rewardHistory.remainReward = saveReward;
    rewardHistory.trId = trId;

    return await transactionManager.save(rewardHistory);
  }

  async useRewardHistory(
    transactionManager: EntityManager,
    { userId, useReward, trId }
  ) : Promise<any> {
    /** 사용한 적립금 내역 추가 */
    const usedRewardHistory = new RewardHistory();
    usedRewardHistory.userId = userId;
    usedRewardHistory.trId = trId;
    usedRewardHistory.type = RewardHistoryType.USE;
    usedRewardHistory.reward = useReward;

    /** 적립금 내역 조회 */
    const rewardHistory: RewardHistory[] = await this.getRewardHistoryForUse(transactionManager, { userId });

    let toUseReward = useReward;
    const usedRewardList = [];

    /** 저장된 적립금 내역에서 사용한 포인트 정보 반영 */
    for (const history of rewardHistory) {
      const { id } = history
      let { remainReward } = history;

      if (remainReward <= 0) continue;

      let decreaseReward = remainReward;
      toUseReward -= remainReward;

      if (toUseReward < 0) {
        decreaseReward -= Math.abs(toUseReward);
      }

      /** 각 적립내역별로 차감해야할 적립금이 달라, bulk update는 구현하지 못함. */
      await transactionManager.createQueryBuilder()
      .update(RewardHistory)
      .where({ id })
      .set({
        remainReward: () => 'remainReward - :decreaseReward'
      })
      .setParameter('decreaseReward', decreaseReward)
      .execute();

      /** 사용한 적립금 내역 정보 추가 */
      usedRewardList.push({ id, decreaseReward });

      if (toUseReward <= 0) break;
    }

    usedRewardHistory.usedRewardList = JSON.stringify(usedRewardList);

    return await transactionManager.save(usedRewardHistory);
  }

  async expireRewardHistory(
    transactionManager: EntityManager,
    { userId }
  ): Promise<number> {
    let expireReward = 0;

    const willExpireRewardHistory = await this.getRewardHistoryForExpire(transactionManager, { userId });

    if (willExpireRewardHistory && !willExpireRewardHistory.length) return 0;

    for (const history of willExpireRewardHistory) {
      const { id, remainReward } = history;

      await transactionManager.softDelete(RewardHistory, { id });
      if (remainReward > 0) expireReward += remainReward;
    }

    return expireReward;
  }
}
