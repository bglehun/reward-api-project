import { RewardService } from './reward.service';
import { getRewardListDto, saveRewardDto, useRewardDto } from './dto/reward.dto';
import { RewardHistory } from './entities/reward-history.entity';
import { Reward } from './entities/reward.entity';
export declare class RewardController {
    private readonly rewardService;
    constructor(rewardService: RewardService);
    get(userId: string, rewardInfo: Reward): Reward;
    getList(userId: string, cursor: getRewardListDto): Promise<RewardHistory[]>;
    save(userId: string, params: saveRewardDto): Promise<Reward>;
    use(userId: string, params: useRewardDto): Promise<Reward>;
}
