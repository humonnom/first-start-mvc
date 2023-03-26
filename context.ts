import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma.service';

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = () => {
  const prismaClient = mockDeep<PrismaClient>({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn(({ data }) => {
        return {
          id: 1,
          age: data.age,
          email: data.email,
          name: data.name,
          phone: data.phone,
        };
      }) as any,
    },
  });

  return prismaClient as unknown as PrismaService;
};
