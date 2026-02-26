import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { BrevoService } from 'src/brevo/brevo.service';

@Controller('patients')
@UseGuards(SupabaseAuthGuard)
export class PatientController {
  constructor(private prisma: PrismaService, private brevo: BrevoService,) {}

  @Get()
  async findAll() {
    return this.prisma.patient.findMany({
      include: { ordonnances: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Body() dto: CreatePatientDto) {
    const patient = await this.prisma.patient.create({ data: dto });

    // Email de bienvenue
    await this.brevo.sendTransactional(
      patient.email!,
      'Bienvenue chez MediCRM - Votre kiné vous attend',
      `<h2>Bonjour ${patient.prenom},</h2><p>Votre dossier a été créé avec succès.</p><p>Nous vous contacterons très vite pour votre premier bilan.</p>`
    );

    // Log activité
    await this.prisma.activite.create({
      data: {
        type: 'note',
        description: `Nouveau patient créé : ${patient.prenom} ${patient.nom}`,
        patientId: patient.id,
      },
    });

    return patient;
  }
}