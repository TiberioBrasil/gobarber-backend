import faker from 'faker/locale/pt_BR';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let repository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;

  let name: string;
  let email: string;
  let password: string;
  let avatarFilename: string;
  let updateAvatarFilename: string;

  beforeAll(() => {
    name = faker.name.firstName();
    email = faker.internet.email();
    password = faker.internet.password();

    avatarFilename = 'avatar.jpg';
    updateAvatarFilename = 'update_avatar.jpg';
  });

  beforeEach(() => {
    repository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
  });

  it('should be able to update users avatar', async () => {
    const updateUserAvatar = new UpdateUserAvatarService(
      repository,
      fakeStorageProvider,
    );

    const user = await repository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    });

    expect(user.avatar).toEqual(avatarFilename);
  });

  it('should not be able to update avatar from non existing user', async () => {
    const updateUserAvatar = new UpdateUserAvatarService(
      repository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'invalid user',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      repository,
      fakeStorageProvider,
    );

    const user = await repository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: updateAvatarFilename,
    });

    expect(deleteFile).toHaveBeenCalledWith(avatarFilename);
    expect(user.avatar).toEqual(updateAvatarFilename);
  });
});
