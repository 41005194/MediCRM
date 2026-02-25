import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
@UseGuards(SupabaseAuthGuard)
export class PatientController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.patient.findMany({
      include: { ordonnances: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Body() dto: CreatePatientDto) {
    return this.prisma.patient.create({ data: dto });
  }
}