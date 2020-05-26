import faker from 'faker/locale/pt_BR';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

let name: string;
let email: string;
let password: string;
let avatarFilename: string;
let updateAvatarFilename: string;

describe('UpdateUserAvatar', () => {
  beforeAll(() => {
    name = faker.name.firstName();
    email = faker.internet.email();
    password = faker.internet.password();

    avatarFilename = 'avatar.jpg';
    updateAvatarFilename = 'update_avatar.jpg';
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update users avatar', async () => {
    const user = await fakeUsersRepository.create({
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
    await expect(
      updateUserAvatar.execute({
        user_id: 'invalid user',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
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
