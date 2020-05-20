import faker from 'faker/locale/pt_BR';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

describe('CreateAppointment', () => {
  let repository: FakeAppointmentsRepository;

  let provider_id: string;
  let date: Date;

  beforeAll(() => {
    provider_id = faker.random.uuid();
    date = new Date(3000, 0, 1, 0, 0, 0);
  });

  beforeEach(() => {
    repository = new FakeAppointmentsRepository();
  });

  it('should be able to create a new appointment', async () => {
    const createAppointment = new CreateAppointmentService(repository);

    const appointment = await createAppointment.execute({
      provider_id,
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toEqual(provider_id);
    expect(appointment.date).toEqual(date);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const createAppointment = new CreateAppointmentService(repository);

    await createAppointment.execute({
      provider_id,
      date,
    });

    expect(
      createAppointment.execute({
        provider_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
