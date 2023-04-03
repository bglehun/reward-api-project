export declare enum RewardHistoryType {
    SAVE = "save",
    USE = "use"
}
export declare class RewardHistory {
    id: number;
    userId: string;
    trId: string;
    type: RewardHistoryType;
    reward: number;
    remainReward: number;
    usedRewardList: string;
    createdAt: Date;
    updatedAt: Date;
    expiredAt: Date;
}
