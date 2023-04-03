import { Reward } from '../entities/reward.entity';

export interface IRewardIncludeRequest extends Request {
  params: any;
  body: any;
  query: any;
  rewardInfo: Reward;
}
