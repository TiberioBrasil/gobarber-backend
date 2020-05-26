import faker from 'faker/locale/pt_BR';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

let name1: string;
let email1: string;
let password1: string;

let name2: string;
let email2: string;
let password2: string;

let name3: string;
let email3: string;
let password3: string;

describe('ListProviders', () => {
  beforeAll(() => {
    name1 = faker.name.firstName();
    email1 = faker.internet.email();
    password1 = faker.internet.password();

    name2 = faker.name.firstName();
    email2 = faker.internet.email();
    password2 = faker.internet.password();

    name3 = faker.name.firstName();
    email3 = faker.internet.email();
    password3 = faker.internet.password();
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: name1,
      email: email1,
      password: password1,
    });

    const user2 = await fakeUsersRepository.create({
      name: name2,
      email: email2,
      password: password2,
    });

    const loggedUser = await fakeUsersRepository.create({
      name: name3,
      email: email3,
      password: password3,
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
