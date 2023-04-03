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
exports.getRewardListDto = exports.useRewardDto = exports.saveRewardDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class saveRewardDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '적립금', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], saveRewardDto.prototype, "saveReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'transaction ID (적립금이 발생한 거래의 고유 ID)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], saveRewardDto.prototype, "trId", void 0);
exports.saveRewardDto = saveRewardDto;
class useRewardDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용할 적립금', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], useRewardDto.prototype, "useReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'transaction ID (적립금을 사용한 거래의 고유 ID)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], useRewardDto.prototype, "trId", void 0);
exports.useRewardDto = useRewardDto;
class getRewardListDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: '페이지네이션 정보. 마지막으로 전달받은 적립금 내역의 id', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], getRewardListDto.prototype, "cursor", void 0);
exports.getRewardListDto = getRewardListDto;
//# sourceMappingURL=reward.dto.js.map