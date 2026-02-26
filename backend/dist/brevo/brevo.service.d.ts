import { ConfigService } from '@nestjs/config';
export declare class BrevoService {
    private configService;
    constructor(configService: ConfigService);
    sendTransactional(to: string, subject: string, htmlContent: string): Promise<void>;
}
