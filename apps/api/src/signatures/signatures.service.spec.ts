import { Test, TestingModule } from '@nestjs/testing';
import { SignaturesService } from './signatures.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('SignaturesService', () => {
  let service: SignaturesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    signature: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignaturesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SignaturesService>(SignaturesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if signature not found', async () => {
      mockPrismaService.signature.findUnique.mockResolvedValue(null);
      await expect(service.findOne('user1', 'sig1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if signature belongs to another user', async () => {
      mockPrismaService.signature.findUnique.mockResolvedValue({ userId: 'user2' });
      await expect(service.findOne('user1', 'sig1')).rejects.toThrow(ForbiddenException);
    });

    it('should return signature if it exists and belongs to the user', async () => {
      const mockSignature = { id: 'sig1', userId: 'user1', name: 'Test' };
      mockPrismaService.signature.findUnique.mockResolvedValue(mockSignature);
      const result = await service.findOne('user1', 'sig1');
      expect(result).toEqual(mockSignature);
    });
  });

  describe('create', () => {
    it('should create a signature with userId', async () => {
      const dto = { name: 'New Sig', email: 'test@test.com', templateId: 'std' };
      const userId = 'user1';
      await service.create(userId, dto as any);
      expect(prisma.signature.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId, name: 'New Sig' }),
      });
    });
  });
});
