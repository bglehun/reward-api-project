import { DataSource } from 'typeorm';
import { RewardRepository } from './repositories/reward.repository';
import { RewardHistoryRepository } from './repositories/reward-history.repository';
import { Reward } from './entities/reward.entity';
import { RewardHistory } from './entities/reward-history.entity';
import { getRewardListDto } from './dto/reward.dto';
import { ConfigService } from '@nestjs/config';
export declare class RewardService {
    private rewardRepository;
    private rewardHistoryRepository;
    private dataSource;
    private configService;
    constructor(rewardRepository: RewardRepository, rewardHistoryRepository: RewardHistoryRepository, dataSource: DataSource, configService: ConfigService);
    getRewardHistory(params: {
        userId: string;
        cursor: getRewardListDto;
    }): Promise<RewardHistory[]>;
    saveReward(params: {
        userId: string;
        saveReward: number;
        trId?: string;
    }): Promise<Reward>;
    useReward(params: {
        userId: string;
        useReward: number;
        trId?: string;
    }): Promise<Reward>;
    expireRewardInMiddleWare(params: {
        userId: string;
    }): Promise<Reward>;
}
