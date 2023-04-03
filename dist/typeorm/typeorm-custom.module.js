"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCustomModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_custom_decorator_1 = require("./typeorm-custom.decorator");
class TypeOrmCustomModule {
    static forCustomRepository(repositories) {
        const providers = [];
        for (const repository of repositories) {
            const entity = Reflect.getMetadata(typeorm_custom_decorator_1.TYPEORM_CUSTOM_REPOSITORY, repository);
            if (!entity) {
                continue;
            }
            providers.push({
                inject: [(0, typeorm_1.getDataSourceToken)()],
                provide: repository,
                useFactory: (dataSource) => {
                    const baseRepository = dataSource.getRepository(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                },
            });
        }
        return {
            exports: providers,
            module: TypeOrmCustomModule,
            providers,
        };
    }
}
exports.TypeOrmCustomModule = TypeOrmCustomModule;
//# sourceMappingURL=typeorm-custom.module.js.map