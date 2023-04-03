import { Controller, Get, Body, Patch, Param, Query, UseInterceptors } from '@nestjs/common';
import { RewardService } from './reward.service';
import { getRewardListDto, saveRewardDto, useRewardDto } from './dto/reward.dto';
import { RewardHistory } from './entities/reward-history.entity';
import { GetReward } from '../common/decorators/get-reward.decorator';
import { Reward } from './entities/reward.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from '../common/interceptors/transaction-interceptor';
import { TransactionManager } from '../common/decorators/transaction-manager.decorator';
import { EntityManager } from 'typeorm';

@ApiTags('Reward')
@Controller('reward')
@UseInterceptors(TransactionInterceptor)
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('/:userId')
  @ApiOperation({
    summary: '적립금 정보 조회',
    description: 'middleware에서 적립금 만료처리 후 반환된 적립금을 조회합니다.  만약, 적립금 정보가 없는 경우에는 초기 데이터 생성하여 조회합니다.',
  })
  @ApiResponse({ description: '조회 성공', type: Reward })
  get(
    @Param('userId') userId: string,
    @GetReward() rewardInfo: Reward
  ): Reward {
    return rewardInfo;
  }

  @Get('list/:userId')
  @ApiOperation({
    summary: '적립금 내역 조회',
    description: '페이지네이션을 이용한 적립금 내역을 조회합니다. cursor 값이 없는 경우, 첫번째 페이지를 조회합니다.',
  })
  @ApiResponse({ description: '조회 성공', type: RewardHistory })
  getList(
    @Param('userId') userId: string,
    @Query('cursor') cursor: getRewardListDto,
    @TransactionManager() transactionManager: EntityManager,
  ): Promise<RewardHistory[]> {
    return this.rewardService.getRewardHistory(transactionManager, { userId, cursor });
  }

  @Patch('save/:userId')
  @ApiOperation({
    summary: '적립금 적립',
    description: '새로운 적립금을 적립합니다.',
  })
  @ApiResponse({ description: '적립 성공', type: Reward })
  @ApiResponse({ description: 'trId 중복 시 에러 ', status: 400 })
  save(
    @Param('userId') userId: string,
    @Body() params: saveRewardDto,
    @TransactionManager() transactionManager: EntityManager,
): Promise<Reward> {
    return this.rewardService.saveReward(transactionManager, { userId, ...params });
  }

  @Patch('use/:userId')
  @ApiOperation({
    summary: '적립금 사용',
    description: '적립금 사용합니다.',
  })
  @ApiResponse({ description: '사용 성공', type: Reward })
  @ApiResponse({ description: '적립금이 부족한 경우 에러', status: 400 })
  @ApiResponse({ description: 'trId 중복 시 에러 ', status: 400 })
  use(
    @Param('userId') userId: string,
    @Body() params: useRewardDto,
    @TransactionManager() transactionManager: EntityManager,
  ): Promise<Reward> {
    return this.rewardService.useReward(transactionManager, { userId, ...params });
  }
}
