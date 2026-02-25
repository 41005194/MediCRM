import { Module } from '@nestjs/common';
import { OrdonnanceController } from './ordonnance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdonnanceController],
})
export class OrdonnanceModule {}