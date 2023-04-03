import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RewardService } from '../reward.service';
import { IRewardIncludeRequest } from '../interfaces/reward-request.interface';

@Injectable()
export class ExpireRewardMiddleware implements NestMiddleware {
  constructor(private rewardService: RewardService) {
  }
    async use(req: IRewardIncludeRequest, res: Response, next: NextFunction) {
    const { userId } = req.params;

    req.rewardInfo = await this.rewardService.expireRewardInMiddleWare({ userId });
    next();
  }
}
