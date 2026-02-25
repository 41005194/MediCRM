import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { CreateOrdonnanceDto } from './dto/create-ordonnance.dto';

@Controller('ordonnances')
@UseGuards(SupabaseAuthGuard)
export class OrdonnanceController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.ordonnance.findMany({
      include: {
        patient: true,
        medecin: true,
        praticien: true,
        seances: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Body() dto: CreateOrdonnanceDto) {
    return this.prisma.ordonnance.create({ data: dto });
  }
}