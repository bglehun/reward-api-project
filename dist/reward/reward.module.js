"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardModule = void 0;
const common_1 = require("@nestjs/common");
const reward_service_1 = require("./reward.service");
const reward_controller_1 = require("./reward.controller");
const typeorm_custom_module_1 = require("../typeorm/typeorm-custom.module");
const reward_repository_1 = require("./repositories/reward.repository");
const reward_history_repository_1 = require("./repositories/reward-history.repository");
const expire_reward_middleware_1 = require("./middleware/expire-reward.middleware");
let RewardModule = class RewardModule {
    configure(consumer) {
        consumer.apply(expire_reward_middleware_1.ExpireRewardMiddleware).forRoutes(reward_controller_1.RewardController);
    }
};
RewardModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_custom_module_1.TypeOrmCustomModule.forCustomRepository([reward_repository_1.RewardRepository, reward_history_repository_1.RewardHistoryRepository])],
        controllers: [reward_controller_1.RewardController],
        providers: [reward_service_1.RewardService],
        exports: [reward_service_1.RewardService],
    })
], RewardModule);
exports.RewardModule = RewardModule;
//# sourceMappingURL=reward.module.js.map