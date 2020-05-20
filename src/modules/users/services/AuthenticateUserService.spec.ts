import faker from 'faker/locale/pt_BR';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  let repository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;

  let name: string;
  let email: string;
  let password: string;

  beforeAll(() => {
    name = faker.name.firstName();
    email = faker.internet.email();
    password = faker.internet.password();
  });

  beforeEach(() => {
    repository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
  });

  it('should be able to authenticate', async () => {
    const createUser = new CreateUserService(repository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(
      repository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const response = await authenticateUser.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with incorrect email', async () => {
    const authenticateUser = new AuthenticateUserService(
      repository,
      fakeHashProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'invalid@email.com',
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const createUser = new CreateUserService(repository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(
      repository,
      fakeHashProvider,
    );

    await createUser.execute({
      name,
      email,
      password,
    });

    expect(
      authenticateUser.execute({
        email,
        password: 'invalid password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
