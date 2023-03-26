import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UserCreationErrors } from './domain/errors';
import UserRepository from './infra/user.repository';
import { createMockContext } from '../../context';
import { UserMapper } from './domain/user.mapper';
import * as O from 'fp-ts/Option';

jest.mock('./infra/user.repository');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    prisma = createMockContext();
    userRepository = new UserRepository(prisma) as jest.Mocked<UserRepository>;

    service = new UserService(prisma, userRepository);
  });

  describe('createUser', () => {
    it('should return user id', async () => {
      const user = {
        age: 42,
        name: 'jueun',
        phone: '010-1234-5678',
        email: 'alreadyExists@email.com',
      };

      userRepository.findUserByEmail.mockResolvedValueOnce(
        O.fromNullable(null),
      );

      userRepository.saveUser.mockResolvedValueOnce(
        UserMapper.toDomain({ id: 1, ...user }),
      );

      const saved = await service.createUser(user);
      expect((saved as any).right?.id).not.toBeUndefined();
    });

    test('Email duplication error', async () => {
      const user = {
        age: 42,
        name: 'jueun',
        phone: '010-1234-5678',
        email: 'alreadyExists@email.com',
      };

      userRepository.findUserByEmail.mockResolvedValueOnce(
        O.of(UserMapper.toDomain({ id: 1, ...user })),
      );

      const saved = await service.createUser(user);
      expect((saved as any).left).toBe(UserCreationErrors.EmailAlreadyExists);
    });
  });
});
