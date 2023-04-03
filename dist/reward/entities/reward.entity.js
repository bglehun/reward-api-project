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
exports.Reward = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Reward = class Reward {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용자 고유 ID' }),
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', nullable: false, length: 50 }),
    __metadata("design:type", String)
], Reward.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '총 적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Reward.prototype, "savedReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용한 적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Reward.prototype, "usedReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '만료된 적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Reward.prototype, "expiredReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용 가능한 적립금' }),
    (0, typeorm_1.Column)({ type: 'integer', unsigned: true, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Reward.prototype, "remainReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reward.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수정일' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reward.prototype, "updatedAt", void 0);
Reward = __decorate([
    (0, typeorm_1.Entity)('reward', { schema: 'test' })
], Reward);
exports.Reward = Reward;
//# sourceMappingURL=reward.entity.js.map