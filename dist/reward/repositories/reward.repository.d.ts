import { Reward } from '../entities/reward.entity';
import { EntityManager, Repository } from 'typeorm';
export declare class RewardRepository extends Repository<Reward> {
    private createReward;
    getReward({ userId }: {
        userId: any;
    }): Promise<Reward>;
    saveReward(transactionManager: EntityManager, { userId, saveReward }: {
        userId: any;
        saveReward: any;
    }): Promise<Reward>;
    useReward(transactionManager: EntityManager, { userId, useReward }: {
        userId: any;
        useReward: any;
    }): Promise<Reward>;
    expireReward(transactionManager: EntityManager, { userId, expireReward }: {
        userId: any;
        expireReward: any;
    }): Promise<Reward>;
}
