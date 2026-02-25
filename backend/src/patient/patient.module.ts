import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatientController],
})
export class PatientModule {}