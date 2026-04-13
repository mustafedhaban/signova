"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const signatures_service_1 = require("./signatures.service");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe('SignaturesService', () => {
    let service;
    let prisma;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                signatures_service_1.SignaturesService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(signatures_service_1.SignaturesService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findOne', () => {
        it('should throw NotFoundException if signature not found', async () => {
            mockPrismaService.signature.findUnique.mockResolvedValue(null);
            await expect(service.findOne('user1', 'sig1')).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw ForbiddenException if signature belongs to another user', async () => {
            mockPrismaService.signature.findUnique.mockResolvedValue({ userId: 'user2' });
            await expect(service.findOne('user1', 'sig1')).rejects.toThrow(common_1.ForbiddenException);
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
            await service.create(userId, dto);
            expect(prisma.signature.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ userId, name: 'New Sig' }),
            });
        });
    });
});
//# sourceMappingURL=signatures.service.spec.js.map