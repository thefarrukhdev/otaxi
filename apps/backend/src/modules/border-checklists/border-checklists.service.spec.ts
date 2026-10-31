import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BorderChecklistsService } from './border-checklists.service';
import { PrismaService } from '../../database/prisma.service';
import { CountryCode } from '@prisma/client';

describe('BorderChecklistsService', () => {
  let service: BorderChecklistsService;
  let prisma: {
    borderChecklist: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
    };
  };

  const mockChecklist = {
    id: 'chk-1',
    fromCountry: CountryCode.UZ,
    toCountry: CountryCode.KZ,
    title: 'O`zbekiston ➔ Qozog`iston',
    description: 'Chegara talablari',
    items: [],
    version: '1.4',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      borderChecklist: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorderChecklistsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<BorderChecklistsService>(BorderChecklistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChecklists', () => {
    it('should return specific checklist when from and to are provided', async () => {
      prisma.borderChecklist.findUnique.mockResolvedValue(mockChecklist);

      const result = await service.getChecklists(CountryCode.UZ, CountryCode.KZ);

      expect(prisma.borderChecklist.findUnique).toHaveBeenCalledWith({
        where: {
          fromCountry_toCountry: {
            fromCountry: CountryCode.UZ,
            toCountry: CountryCode.KZ,
          },
        },
      });
      expect(result).toEqual([mockChecklist]);
    });

    it('should return empty array if specific checklist not found', async () => {
      prisma.borderChecklist.findUnique.mockResolvedValue(null);

      const result = await service.getChecklists(CountryCode.UZ, CountryCode.KZ);

      expect(result).toEqual([]);
    });

    it('should return all checklists when no countries provided', async () => {
      prisma.borderChecklist.findMany.mockResolvedValue([mockChecklist]);

      const result = await service.getChecklists();

      expect(prisma.borderChecklist.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockChecklist]);
    });
  });

  describe('getChecklistById', () => {
    it('should return checklist when found by ID', async () => {
      prisma.borderChecklist.findUnique.mockResolvedValue(mockChecklist);

      const result = await service.getChecklistById('chk-1');

      expect(result).toEqual(mockChecklist);
    });

    it('should throw NotFoundException when checklist does not exist', async () => {
      prisma.borderChecklist.findUnique.mockResolvedValue(null);

      await expect(service.getChecklistById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
