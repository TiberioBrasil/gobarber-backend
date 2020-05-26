import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindProvidersByMonthDTO from '@modules/appointments/dtos/IFindProvidersByMonthDTO';
import IFindProvidersByDayDTO from '@modules/appointments/dtos/IFindProvidersByDayDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findProvidersByMonth(data: IFindProvidersByMonthDTO): Promise<Appointment[]>;
  findProvidersByDay(data: IFindProvidersByDayDTO): Promise<Appointment[]>;
}
