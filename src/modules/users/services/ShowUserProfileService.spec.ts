import faker from 'faker/locale/pt_BR';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

let name: string;
let email: string;
let password: string;

describe('ShowUserProfile', () => {
  beforeAll(() => {
    name = faker.name.firstName();
    email = faker.internet.email();
    password = faker.internet.password();
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const showUserProfile = await showUserProfileService.execute({
      user_id: user.id,
    });

    expect(showUserProfile.name).toEqual(name);
    expect(showUserProfile.email).toEqual(email);
  });

  it('should not be able to show user profile with a non-existing user id', async () => {
    await expect(
      showUserProfileService.execute({
        user_id: 'Invalid user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
