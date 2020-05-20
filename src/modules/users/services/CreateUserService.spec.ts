import faker from 'faker/locale/pt_BR';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

describe('CreateUser', () => {
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

  it('should be able to create a new user', async () => {
    const createUser = new CreateUserService(repository, fakeHashProvider);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('should not be able to create a new user with an existing email', async () => {
    const createUser = new CreateUserService(repository, fakeHashProvider);

    await createUser.execute({
      name,
      email,
      password,
    });

    expect(
      createUser.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
