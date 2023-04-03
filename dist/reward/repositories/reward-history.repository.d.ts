import { RewardHistory } from '../entities/reward-history.entity';
import { EntityManager, Repository } from 'typeorm';
export declare class RewardHistoryRepository extends Repository<RewardHistory> {
    private getRewardHistoryForUse;
    private getRewardHistoryForExpire;
    getRewardHistoryWithPagination(transactionManager: EntityManager, { userId, cursor, limit }: {
        userId: any;
        cursor: any;
        limit?: number;
    }): Promise<RewardHistory[]>;
    saveRewardHistory(transactionManager: EntityManager, { userId, saveReward, trId }: {
        userId: any;
        saveReward: any;
        trId: any;
    }): Promise<any>;
    useRewardHistory(transactionManager: EntityManager, { userId, useReward, trId }: {
        userId: any;
        useReward: any;
        trId: any;
    }): Promise<any>;
    expireRewardHistory(transactionManager: EntityManager, { userId }: {
        userId: any;
    }): Promise<number>;
}
