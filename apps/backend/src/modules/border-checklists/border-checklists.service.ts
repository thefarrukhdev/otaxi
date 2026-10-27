import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CountryCode } from '@prisma/client';

@Injectable()
export class BorderChecklistsService {
  constructor(private readonly prisma: PrismaService) {}

  async getChecklists(from?: CountryCode, to?: CountryCode) {
    if (from && to) {
      const checklist = await this.prisma.borderChecklist.findUnique({
        where: {
          fromCountry_toCountry: {
            fromCountry: from,
            toCountry: to,
          },
        },
      });

      if (!checklist) {
        return [];
      }

      return [checklist];
    }

    const where: any = {};
    if (from) where.fromCountry = from;
    if (to) where.toCountry = to;

    return this.prisma.borderChecklist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getChecklistById(id: string) {
    const checklist = await this.prisma.borderChecklist.findUnique({
      where: { id },
    });

    if (!checklist) {
      throw new NotFoundException('Chegara chek-listi topilmadi');
    }

    return checklist;
  }
}
