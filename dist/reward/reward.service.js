"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const reward_repository_1 = require("./repositories/reward.repository");
const reward_history_repository_1 = require("./repositories/reward-history.repository");
const config_1 = require("@nestjs/config");
let RewardService = class RewardService {
    constructor(rewardRepository, rewardHistoryRepository, dataSource, configService) {
        this.rewardRepository = rewardRepository;
        this.rewardHistoryRepository = rewardHistoryRepository;
        this.dataSource = dataSource;
        this.configService = configService;
    }
    async getRewardHistory(params) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            const rewardHistory = await this.rewardHistoryRepository.getRewardHistoryWithPagination(queryRunner.manager, Object.assign(Object.assign({}, params), { limit: Number(this.configService.get('PAGINATION_LIMIT')) }));
            await queryRunner.commitTransaction();
            return rewardHistory;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(err);
        }
        finally {
            await queryRunner.release();
        }
        return;
    }
    async saveReward(params) {
        const { userId, saveReward, trId } = params;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            const rewardInfo = await this.rewardRepository.saveReward(queryRunner.manager, { userId, saveReward });
            await this.rewardHistoryRepository.saveRewardHistory(queryRunner.manager, { userId, saveReward, trId });
            await queryRunner.commitTransaction();
            return rewardInfo;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(err);
        }
        finally {
            await queryRunner.release();
        }
    }
    async useReward(params) {
        const { userId, useReward, trId } = params;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            const rewardInfo = await this.rewardRepository.useReward(queryRunner.manager, { userId, useReward });
            await this.rewardHistoryRepository.useRewardHistory(queryRunner.manager, { userId, useReward, trId });
            await queryRunner.commitTransaction();
            return rewardInfo;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(err);
        }
        finally {
            await queryRunner.release();
        }
    }
    async expireRewardInMiddleWare(params) {
        const { userId } = params;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            let rewardInfo = await this.rewardRepository.getReward({ userId });
            if (rewardInfo && rewardInfo.remainReward > 0) {
                const expireReward = await this.rewardHistoryRepository.expireRewardHistory(queryRunner.manager, { userId });
                if (expireReward > 0)
                    rewardInfo = await this.rewardRepository.expireReward(queryRunner.manager, { userId, expireReward });
            }
            await queryRunner.commitTransaction();
            return rewardInfo;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(err);
        }
        finally {
            await queryRunner.release();
        }
    }
};
RewardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reward_repository_1.RewardRepository,
        reward_history_repository_1.RewardHistoryRepository,
        typeorm_1.DataSource,
        config_1.ConfigService])
], RewardService);
exports.RewardService = RewardService;
//# sourceMappingURL=reward.service.js.map