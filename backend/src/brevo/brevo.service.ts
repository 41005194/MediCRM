import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrevoService {
  constructor(private configService: ConfigService) {}

  async sendTransactional(to: string, subject: string, htmlContent: string) {
    const payload = {
      sender: {
        name: this.configService.get<string>('BREVO_SENDER_NAME')!,
        email: this.configService.get<string>('BREVO_SENDER_EMAIL')!,
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.configService.get<string>('BREVO_API_KEY')!,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`✅ Email Brevo envoyé à ${to}`);
      } else {
        const error = await response.text();
        console.error('❌ Erreur Brevo :', error);
      }
    } catch (error) {
      console.error('❌ Erreur fetch Brevo :', error);
    }
  }
}