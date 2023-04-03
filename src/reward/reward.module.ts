import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmCustomModule } from '../typeorm/typeorm-custom.module';
import { RewardRepository } from './repositories/reward.repository';
import { RewardHistoryRepository } from './repositories/reward-history.repository';
import { ExpireRewardMiddleware } from './middleware/expire-reward.middleware';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmCustomModule.forCustomRepository([RewardRepository, RewardHistoryRepository])],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExpireRewardMiddleware).forRoutes(RewardController);
  }
}
