import faker from 'faker/locale/pt_BR';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;

let name: string;
let email: string;
let password: string;
let newName: string;
let newEmail: string;
let newPassword: string;

describe('UpdateUserProfile', () => {
  beforeAll(() => {
    name = faker.name.firstName();
    email = faker.internet.email();
    password = faker.internet.password();

    newName = faker.name.firstName();
    newEmail = faker.internet.email();
    newPassword = faker.internet.password();
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
    });

    expect(updatedUser.name).toEqual(newName);
    expect(updatedUser.email).toEqual(newEmail);
  });

  it('should not be able to show user profile with a non-existing user id', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: 'Invalid user_id',
        name: newName,
        email: newEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update email to an existing one', async () => {
    await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const user = await fakeUsersRepository.create({
      name: newName,
      email: newEmail,
      password: newPassword,
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: newName,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
      old_password: password,
      password: newPassword,
    });

    expect(updatedUser.password).toEqual(newPassword);
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: newName,
        email: newEmail,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: newName,
        email: newEmail,
        old_password: 'Invalid old password',
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
