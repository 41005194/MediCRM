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
exports.BrevoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let BrevoService = class BrevoService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async sendTransactional(to, subject, htmlContent) {
        const payload = {
            sender: {
                name: this.configService.get('BREVO_SENDER_NAME'),
                email: this.configService.get('BREVO_SENDER_EMAIL'),
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent,
        };
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': this.configService.get('BREVO_API_KEY'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                console.log(`✅ Email Brevo envoyé à ${to}`);
            }
            else {
                const error = await response.text();
                console.error('❌ Erreur Brevo :', error);
            }
        }
        catch (error) {
            console.error('❌ Erreur fetch Brevo :', error);
        }
    }
};
exports.BrevoService = BrevoService;
exports.BrevoService = BrevoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BrevoService);
//# sourceMappingURL=brevo.service.js.map