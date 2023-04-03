"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardHistoryRepository = void 0;
const typeorm_custom_decorator_1 = require("../../typeorm/typeorm-custom.decorator");
const reward_history_entity_1 = require("../entities/reward-history.entity");
const typeorm_1 = require("typeorm");
let RewardHistoryRepository = class RewardHistoryRepository extends typeorm_1.Repository {
    async getRewardHistoryForUse(transactionManager, { userId }) {
        const rewardHistory = await transactionManager.find(reward_history_entity_1.RewardHistory, {
            where: {
                userId,
                remainReward: (0, typeorm_1.MoreThan)(0),
            },
            order: { createdAt: 'asc' },
        });
        return rewardHistory;
    }
    async getRewardHistoryForExpire(transactionManager, { userId }) {
        const now = new Date();
        const aYearAgo = new Date(now.setUTCFullYear(now.getFullYear() - 1));
        const willExpireRewardHistory = await transactionManager.find(reward_history_entity_1.RewardHistory, {
            where: {
                userId,
                createdAt: (0, typeorm_1.LessThanOrEqual)(aYearAgo),
            },
        });
        return willExpireRewardHistory;
    }
    async getRewardHistoryWithPagination(transactionManager, { userId, cursor, limit = 10 }) {
        if (isNaN(cursor))
            cursor = Number.MAX_SAFE_INTEGER;
        const subQuery = transactionManager.createQueryBuilder(reward_history_entity_1.RewardHistory, 'subquery').select('subquery.id').addSelect('subquery.userId').useIndex('idx_id_userId_expiredAt').where(`subquery.id < :cursor`).andWhere('subquery.userId = :userId').orderBy('subquery.id', 'DESC').limit(limit).getQuery();
        const rewardHistory = await transactionManager.createQueryBuilder(reward_history_entity_1.RewardHistory, 'main').innerJoin(`(${subQuery})`, 'subTable', 'main.id = subTable.`subquery_id` AND main.userId = subTable.`subquery_userId`').setParameter('userId', userId).setParameter('cursor', cursor).useIndex('idx_id_userId_expiredAt').getMany();
        return rewardHistory.sort((a, b) => b.id - a.id);
    }
    async saveRewardHistory(transactionManager, { userId, saveReward, trId }) {
        const rewardHistory = new reward_history_entity_1.RewardHistory();
        rewardHistory.userId = userId;
        rewardHistory.type = reward_history_entity_1.RewardHistoryType.SAVE;
        rewardHistory.reward = saveReward;
        rewardHistory.remainReward = saveReward;
        rewardHistory.trId = trId;
        return await transactionManager.save(rewardHistory);
    }
    async useRewardHistory(transactionManager, { userId, useReward, trId }) {
        const usedRewardHistory = new reward_history_entity_1.RewardHistory();
        usedRewardHistory.userId = userId;
        usedRewardHistory.trId = trId;
        usedRewardHistory.type = reward_history_entity_1.RewardHistoryType.USE;
        usedRewardHistory.reward = useReward;
        const rewardHistory = await this.getRewardHistoryForUse(transactionManager, { userId });
        let toUseReward = useReward;
        const usedRewardList = [];
        for (const history of rewardHistory) {
            const { id } = history;
            let { remainReward } = history;
            if (remainReward <= 0)
                continue;
            let decreaseReward = remainReward;
            toUseReward -= remainReward;
            if (toUseReward < 0) {
                decreaseReward -= Math.abs(toUseReward);
            }
            await transactionManager.createQueryBuilder()
                .update(reward_history_entity_1.RewardHistory)
                .where({ id })
                .set({
                remainReward: () => 'remainReward - :decreaseReward'
            })
                .setParameter('decreaseReward', decreaseReward)
                .execute();
            usedRewardList.push({ id, decreaseReward });
            if (toUseReward <= 0)
                break;
        }
        usedRewardHistory.usedRewardList = JSON.stringify(usedRewardList);
        return await transactionManager.save(usedRewardHistory);
    }
    async expireRewardHistory(transactionManager, { userId }) {
        let expireReward = 0;
        const willExpireRewardHistory = await this.getRewardHistoryForExpire(transactionManager, { userId });
        if (willExpireRewardHistory && !willExpireRewardHistory.length)
            return 0;
        for (const history of willExpireRewardHistory) {
            const { id, remainReward } = history;
            await transactionManager.softDelete(reward_history_entity_1.RewardHistory, { id });
            if (remainReward > 0)
                expireReward += remainReward;
        }
        return expireReward;
    }
};
RewardHistoryRepository = __decorate([
    (0, typeorm_custom_decorator_1.CustomRepository)(reward_history_entity_1.RewardHistory)
], RewardHistoryRepository);
exports.RewardHistoryRepository = RewardHistoryRepository;
//# sourceMappingURL=reward-history.repository.js.map