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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardController = void 0;
const common_1 = require("@nestjs/common");
const reward_service_1 = require("./reward.service");
const reward_dto_1 = require("./dto/reward.dto");
const reward_history_entity_1 = require("./entities/reward-history.entity");
const get_reward_decorator_1 = require("../decorators/get-reward.decorator");
const reward_entity_1 = require("./entities/reward.entity");
const swagger_1 = require("@nestjs/swagger");
let RewardController = class RewardController {
    constructor(rewardService) {
        this.rewardService = rewardService;
    }
    get(userId, rewardInfo) {
        return rewardInfo;
    }
    getList(userId, cursor) {
        return this.rewardService.getRewardHistory({ userId, cursor });
    }
    save(userId, params) {
        return this.rewardService.saveReward(Object.assign({ userId }, params));
    }
    use(userId, params) {
        return this.rewardService.useReward(Object.assign({ userId }, params));
    }
};
__decorate([
    (0, common_1.Get)('/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '적립금 정보 조회',
        description: 'middleware에서 적립금 만료처리 후 반환된 적립금을 조회합니다.  만약, 적립금 정보가 없는 경우에는 초기 데이터 생성하여 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({ description: '조회 성공', type: reward_entity_1.Reward }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, get_reward_decorator_1.GetReward)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reward_entity_1.Reward]),
    __metadata("design:returntype", reward_entity_1.Reward)
], RewardController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('list/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '적립금 내역 조회',
        description: '페이지네이션을 이용한 적립금 내역을 조회합니다. cursor 값이 없는 경우, 첫번째 페이지를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({ description: '조회 성공', type: reward_history_entity_1.RewardHistory }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reward_dto_1.getRewardListDto]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "getList", null);
__decorate([
    (0, common_1.Patch)('save/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '적립금 적립',
        description: '새로운 적립금을 적립합니다.',
    }),
    (0, swagger_1.ApiResponse)({ description: '적립 성공', type: reward_entity_1.Reward }),
    (0, swagger_1.ApiResponse)({ description: 'trId 중복 시 에러 ', status: 400 }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reward_dto_1.saveRewardDto]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "save", null);
__decorate([
    (0, common_1.Patch)('use/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '적립금 사용',
        description: '적립금 사용합니다.',
    }),
    (0, swagger_1.ApiResponse)({ description: '사용 성공', type: reward_entity_1.Reward }),
    (0, swagger_1.ApiResponse)({ description: '적립금이 부족한 경우 에러', status: 400 }),
    (0, swagger_1.ApiResponse)({ description: 'trId 중복 시 에러 ', status: 400 }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reward_dto_1.useRewardDto]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "use", null);
RewardController = __decorate([
    (0, swagger_1.ApiTags)('Reward'),
    (0, common_1.Controller)('reward'),
    __metadata("design:paramtypes", [reward_service_1.RewardService])
], RewardController);
exports.RewardController = RewardController;
//# sourceMappingURL=reward.controller.js.map