export enum AppointmentStatus {
  SCHEDULED = 'Agendada',
  CANCELLED = 'Cancelada',
  COMPLETED = 'Realizada',
}

export enum DayOfWeek {
  MONDAY = 'Segunda-feira',
  TUESDAY = 'Terça-feira',
  WEDNESDAY = 'Quarta-feira',
  THURSDAY = 'Quinta-feira',
  FRIDAY = 'Sexta-feira',
  SATURDAY = 'Sábado',
  SUNDAY = 'Domingo',
}

export interface Address {
  zip: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Patient {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: Address;
}

export interface Availability {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface Doctor {
  id: string;
  fullName: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
  availability: Availability[];
}

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: Address;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: AppointmentStatus;
  notes?: string;
}

export type ViewType = 'dashboard' | 'patients' | 'doctors' | 'clinics' | 'appointments' | 'profile' | 'settings' | 'about';