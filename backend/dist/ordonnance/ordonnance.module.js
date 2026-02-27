"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdonnanceModule = void 0;
const common_1 = require("@nestjs/common");
const ordonnance_controller_1 = require("./ordonnance.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const brevo_module_1 = require("../brevo/brevo.module");
let OrdonnanceModule = class OrdonnanceModule {
};
exports.OrdonnanceModule = OrdonnanceModule;
exports.OrdonnanceModule = OrdonnanceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, brevo_module_1.BrevoModule],
        controllers: [ordonnance_controller_1.OrdonnanceController],
    })
], OrdonnanceModule);
//# sourceMappingURL=ordonnance.module.js.map