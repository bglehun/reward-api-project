import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { RewardRepository } from "./repositories/reward.repository";
import { RewardHistoryRepository } from './repositories/reward-history.repository';
import { ConfigService } from '@nestjs/config';
import { DataSource, QueryRunner } from 'typeorm';
import { TypeOrmCustomModule } from '../typeorm/typeorm-custom.module';
import { Reward } from './entities/reward.entity';

describe('RewardService', () => {
  let rewardService: RewardService;
  let dataSource: DataSource;

  const qr = {
    manager: {},
  } as QueryRunner;

  class ConnectionMock {
    createQueryRunner(): QueryRunner {
      return qr;
    }
  }

  beforeEach(async () => {
    // reset qr mocked function
    Object.assign(qr.manager, {
      save: jest.fn()
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardService,
        ConfigService,
        RewardRepository,
        RewardHistoryRepository,
        TypeOrmCustomModule,
        {
        provide: DataSource,
        useClass: ConnectionMock,
      }],
    }).compile();

    rewardService = module.get<RewardService>(RewardService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(rewardService).toBeDefined();
  });

  it('should be return an array', () => {
    const result = rewardService.saveReward({ userId: '1', saveReward: 10, trId: 'tr_123' });
    expect(result).toBeInstanceOf(Reward);
  });

});
