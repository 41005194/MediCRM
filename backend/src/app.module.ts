import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { OrdonnanceModule } from './ordonnance/ordonnance.module';
import { BrevoModule } from './brevo/brevo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    PatientModule,
    OrdonnanceModule,
    BrevoModule,
  ],
})
export class AppModule {}