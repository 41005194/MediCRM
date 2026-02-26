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
exports.PatientController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_guard_1 = require("../auth/auth.guard");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const brevo_service_1 = require("../brevo/brevo.service");
let PatientController = class PatientController {
    prisma;
    brevo;
    constructor(prisma, brevo) {
        this.prisma = prisma;
        this.brevo = brevo;
    }
    async findAll() {
        return this.prisma.patient.findMany({
            include: { ordonnances: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(dto) {
        const patient = await this.prisma.patient.create({ data: dto });
        await this.brevo.sendTransactional(patient.email, 'Bienvenue chez MediCRM - Votre kiné vous attend', `<h2>Bonjour ${patient.prenom},</h2><p>Votre dossier a été créé avec succès.</p><p>Nous vous contacterons très vite pour votre premier bilan.</p>`);
        await this.prisma.activite.create({
            data: {
                type: 'note',
                description: `Nouveau patient créé : ${patient.prenom} ${patient.nom}`,
                patientId: patient.id,
            },
        });
        return patient;
    }
};
exports.PatientController = PatientController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "create", null);
exports.PatientController = PatientController = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, brevo_service_1.BrevoService])
], PatientController);
//# sourceMappingURL=patient.controller.js.map