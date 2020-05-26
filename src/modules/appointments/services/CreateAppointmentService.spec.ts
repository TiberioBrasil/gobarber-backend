import faker from 'faker/locale/pt_BR';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

let user_id: string;
let provider_id: string;
let date: Date;
let day: number;
let month: number;
let year: number;

describe('CreateAppointment', () => {
  beforeAll(() => {
    user_id = faker.random.uuid();
    provider_id = faker.random.uuid();

    year = 2030;
    month = 4;
    day = 1;
    date = new Date(year, month, day, 8, 0, 0);
  });

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, 8).getTime();
    });

    const appointment = await createAppointment.execute({
      user_id,
      provider_id,
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toEqual(provider_id);
    expect(appointment.date).toEqual(date);
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({
      user_id,
      provider_id,
      date,
    });

    await expect(
      createAppointment.execute({
        user_id,
        provider_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, 8).getTime();
    });

    await expect(
      createAppointment.execute({
        user_id,
        provider_id,
        date: new Date(year, month, day - 1, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, 8).getTime();
    });

    await expect(
      createAppointment.execute({
        user_id,
        provider_id: user_id,
        date: new Date(year, month, day, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, 8).getTime();
    });

    await expect(
      createAppointment.execute({
        user_id,
        provider_id,
        date: new Date(year, month, day, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        user_id,
        provider_id,
        date: new Date(year, month, day, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should not be able to create an appointment at the same time with same provider', async () => {
  //   jest.spyOn(Date, 'now').mockImplementationOnce(() => {
  //     return new Date(year, month, day, 8).getTime();
  //   });

  //   createAppointment.execute({
  //     user_id,
  //     provider_id,
  //     date: new Date(year, month, day, 8),
  //   });

  //   await expect(
  //     createAppointment.execute({
  //       user_id,
  //       provider_id: user_id,
  //       date: new Date(year, month, day, 8),
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
