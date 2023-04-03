"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardRepository = void 0;
const typeorm_custom_decorator_1 = require("../../typeorm/typeorm-custom.decorator");
const reward_entity_1 = require("../entities/reward.entity");
const typeorm_1 = require("typeorm");
let RewardRepository = class RewardRepository extends typeorm_1.Repository {
    async createReward({ userId }) {
        const reward = new reward_entity_1.Reward();
        reward.userId = userId;
        return await this.save(reward);
    }
    async getReward({ userId }) {
        let reward = await this.findOneBy({ userId });
        if (!reward)
            reward = await this.createReward({ userId });
        return reward;
    }
    async saveReward(transactionManager, { userId, saveReward }) {
        let rewardInfo = await transactionManager.findOneBy(reward_entity_1.Reward, { userId });
        if (!rewardInfo) {
            const reward = new reward_entity_1.Reward();
            reward.userId = userId;
            reward.savedReward = saveReward;
            reward.remainReward = saveReward;
            rewardInfo = await transactionManager.save(reward);
        }
        else {
            await transactionManager.createQueryBuilder()
                .update(reward_entity_1.Reward)
                .where({ userId })
                .set({
                savedReward: () => 'savedReward + :saveReward',
                remainReward: () => 'remainReward + :saveReward'
            })
                .setParameter('saveReward', saveReward)
                .execute();
            rewardInfo = await transactionManager.findOneBy(reward_entity_1.Reward, { userId });
        }
        return rewardInfo;
    }
    async useReward(transactionManager, { userId, useReward }) {
        let rewardInfo = await transactionManager.findOneBy(reward_entity_1.Reward, { userId });
        if (!rewardInfo) {
            throw new Error('Not exists reward info.');
        }
        else if (rewardInfo.remainReward < useReward) {
            throw new Error('Not enough remainReward');
        }
        else {
            await transactionManager.createQueryBuilder()
                .update(reward_entity_1.Reward)
                .where({ userId })
                .set({
                usedReward: () => 'usedReward + :useReward',
                remainReward: () => 'remainReward - :useReward'
            })
                .setParameter('useReward', useReward)
                .execute();
            rewardInfo = await transactionManager.findOneBy(reward_entity_1.Reward, { userId });
        }
        return rewardInfo;
    }
    async expireReward(transactionManager, { userId, expireReward }) {
        await transactionManager.createQueryBuilder()
            .update(reward_entity_1.Reward)
            .where({ userId })
            .set({
            expiredReward: () => 'expiredReward + :expireReward',
            remainReward: () => 'remainReward - :expireReward'
        })
            .setParameter('expireReward', expireReward)
            .execute();
        return await transactionManager.findOneBy(reward_entity_1.Reward, { userId });
    }
};
RewardRepository = __decorate([
    (0, typeorm_custom_decorator_1.CustomRepository)(reward_entity_1.Reward)
], RewardRepository);
exports.RewardRepository = RewardRepository;
//# sourceMappingURL=reward.repository.js.map