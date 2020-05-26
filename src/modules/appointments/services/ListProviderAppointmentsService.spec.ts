import faker from 'faker/locale/pt_BR';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

let user_id: string;
let provider_id: string;
let day: number;
let month: number;
let year: number;

describe('ListProviderAppointments', () => {
  beforeAll(() => {
    user_id = faker.random.uuid();
    provider_id = faker.random.uuid();

    year = 2030;
    month = 4;
    day = 1;
  });

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments of a specific provider on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      user_id,
      provider_id,
      date: new Date(year, month, day, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      user_id,
      provider_id,
      date: new Date(year, month, day, 9, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day,
      month: month + 1,
      year,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
