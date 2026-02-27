import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BrevoModule } from '../brevo/brevo.module';

@Module({
  imports: [PrismaModule, BrevoModule],
  controllers: [PatientController],
})
export class PatientModule {}