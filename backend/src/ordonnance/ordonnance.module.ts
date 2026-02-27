import { Module } from '@nestjs/common';
import { OrdonnanceController } from './ordonnance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BrevoModule } from '../brevo/brevo.module';

@Module({
  imports: [PrismaModule, BrevoModule],
  controllers: [OrdonnanceController],
})
export class OrdonnanceModule {}