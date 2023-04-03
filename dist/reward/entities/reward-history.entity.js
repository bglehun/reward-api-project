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
exports.RewardHistory = exports.RewardHistoryType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var RewardHistoryType;
(function (RewardHistoryType) {
    RewardHistoryType["SAVE"] = "save";
    RewardHistoryType["USE"] = "use";
})(RewardHistoryType = exports.RewardHistoryType || (exports.RewardHistoryType = {}));
let RewardHistory = class RewardHistory {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: '적립금 내역 고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint', }),
    __metadata("design:type", Number)
], RewardHistory.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용자 고유 ID' }),
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], RewardHistory.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'transaction ID (적립금이 발생한 거래의 고유 ID)' }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 40, unique: true }),
    __metadata("design:type", String)
], RewardHistory.prototype, "trId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        enum: RewardHistoryType,
        description: '적립금 내역 타입',
    }),
    (0, typeorm_1.Column)({ type: 'enum', enum: RewardHistoryType, default: RewardHistoryType.SAVE }),
    __metadata("design:type", String)
], RewardHistory.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], RewardHistory.prototype, "reward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '적립금 내 사용 가능한 적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], RewardHistory.prototype, "remainReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '적립금 시 사용한 적립금 정보 (적립금 사용 취소 시 필요한 데이터)',
    }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", String)
], RewardHistory.prototype, "usedRewardList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RewardHistory.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수정일' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RewardHistory.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '만료일 (soft delete)' }),
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], RewardHistory.prototype, "expiredAt", void 0);
RewardHistory = __decorate([
    (0, typeorm_1.Index)('idx_id_userId_expiredAt', ['id', 'userId', 'expiredAt']),
    (0, typeorm_1.Index)('idx_userId_createdAt_expiredAt', ['userId', 'createdAt', 'expiredAt']),
    (0, typeorm_1.Entity)('rewardHistory', { schema: 'test' })
], RewardHistory);
exports.RewardHistory = RewardHistory;
//# sourceMappingURL=reward-history.entity.js.map