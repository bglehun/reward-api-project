"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReward = void 0;
const common_1 = require("@nestjs/common");
exports.GetReward = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.rewardInfo;
});
//# sourceMappingURL=get-reward.decorator.js.map