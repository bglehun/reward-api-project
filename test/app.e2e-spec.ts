import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Reward } from '../src/reward/entities/reward.entity';
import { HttpExceptionFilter } from '../src/common/filter/httpException.filter';
import { ConfigService } from '@nestjs/config';

describe('Reward Controller API e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ConfigService],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('GET /reward/:userId 적립금 조회', () => {
    it('userId 입력 - 성공 (status: 200)', () => {
      return request(app.getHttpServer()).get('/reward/1').expect(200);
    });

    it('userId 미입력 - 실패 (status: 404)', () => {
      return request(app.getHttpServer()).get('/reward/').expect(404);
    });
  });

  describe('GET /reward/list/:userId 적립금 내역 조회', () => {
    it('userId 입력 - 성공 (status: 200)', () => {
      return request(app.getHttpServer()).get('/reward/list/1').expect(200);
    });

    it('userId, cursor 입력 - 성공 (status: 200)', () => {
      return request(app.getHttpServer()).get('/reward/list/1?curser=4').expect(200);
    });

    it('적립금 정보가 없는 userId 입력 - 빈 Array 출력 (result: [])', () => {
      return request(app.getHttpServer()).get('/reward/list/9999').expect([]);
    });
  });

  describe('PATCH /reward/save/:userId 적립금 적립', () => {
    it('saveReward, 중복되지 않은 trId 입력 / userId 미입력 - 실패 (status: 404)', () => {
      return request(app.getHttpServer())
        .patch('/reward/save/')
        .send({ saveReward: 10, trId: 'tr_123455' })
        .expect(404);
    });

    it('userId, saveReward 입력 / 중복되지 않은 trId 입력 - 성공 (status: 200)', () => {
      return request(app.getHttpServer())
        .patch('/reward/save/1')
        .send({ saveReward: 10, trId: 'tr_1234' })
        .expect(200);
    });

    it('userId, saveReward 입력 / 중복된 trId 입력 - 성공 (status: 700)', () => {
      return request(app.getHttpServer())
        .patch('/reward/save/1')
        .send({ saveReward: 10, trId: 'tr_1234' })
        .expect(700);
    });

    it('userId, saveReward 입력 / trId 미입력 - 실패 (status: 700)', () => {
      return request(app.getHttpServer())
        .patch('/reward/save/1')
        .send({ saveReward: 10 })
        .expect(700);
    });

    it('userId, 중복되지 않은 trId 입력 / saveReward 미입력- 실패 (status: 400)', () => {
      return request(app.getHttpServer())
        .patch('/reward/save/1')
        .send({ trId: 'tr_a1435' })
        .expect(400);
    });
  });

  describe('PATCH /reward/use/:userId 적립금 사용', () => {
    it('useReward, 중복되지 않은 trId 입력 / userId 미입력 - 실패 (status: 404)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/')
        .send({ useReward: 10, trId: 'tr_66666' })
        .expect(404);
    });

    it('userId, useReward 입력 / 중복되지 않은 trId 입력 - 성공 (status: 200)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/1')
        .send({ useReward: 10, trId: 'tr_66663' })
        .expect(200);
    });

    it('userId, useReward 입력 / 중복된 trId 입력 - 성공 (status: 400)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/1')
        .send({ useReward: 10, trId: 'tr_66663' })
        .expect(400);
    });

    it('userId, useReward 입력 / trId 미입력 - 실패 (status: 400)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/1')
        .send({ useReward: 10 })
        .expect(400);
    });

    it('userId, 중복되지 않은 trId 입력 / useReward 미입력- 실패 (status: 400)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/1')
        .send({ trId: 'tr_66673' })
        .expect(400);
    });

    it('userId, 중복되지 않은 trId 입력 / remainReward보다 큰 useReward 입력 - 실패 (status: 400)', () => {
      return request(app.getHttpServer())
        .patch('/reward/use/1')
        .send({ useReward: 999999999, trId: 'tr_65663' })
        .expect(400);
    });
  });
});
