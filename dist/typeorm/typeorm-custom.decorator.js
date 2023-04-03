"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepository = exports.TYPEORM_CUSTOM_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
exports.TYPEORM_CUSTOM_REPOSITORY = "TYPEORM_CUSTOM_REPOSITORY";
function CustomRepository(entity) {
    return (0, common_1.SetMetadata)(exports.TYPEORM_CUSTOM_REPOSITORY, entity);
}
exports.CustomRepository = CustomRepository;
//# sourceMappingURL=typeorm-custom.decorator.js.map