import { Module } from '@nestjs/common';
import { BrevoService } from './brevo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BrevoService],
  exports: [BrevoService],
})
export class BrevoModule {}