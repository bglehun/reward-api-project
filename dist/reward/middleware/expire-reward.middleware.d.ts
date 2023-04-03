import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RewardService } from '../reward.service';
import { IRewardIncludeRequest } from '../interfaces/reward-request.interface';
export declare class ExpireRewardMiddleware implements NestMiddleware {
    private rewardService;
    constructor(rewardService: RewardService);
    use(req: IRewardIncludeRequest, res: Response, next: NextFunction): Promise<void>;
}
