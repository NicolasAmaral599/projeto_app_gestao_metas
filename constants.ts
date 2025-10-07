
import { Patient, Doctor, Appointment, AppointmentStatus, DayOfWeek, Clinic } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    fullName: 'Ana Silva',
    cpf: '111.222.333-44',
    birthDate: '1985-05-20',
    phone: '(11) 98765-4321',
    email: 'ana.silva@example.com',
    address: { zip: '01000-000', street: 'Rua A', number: '123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }
  },
  {
    id: 'p2',
    fullName: 'Bruno Costa',
    cpf: '222.333.444-55',
    birthDate: '1990-11-15',
    phone: '(21) 91234-5678',
    email: 'bruno.costa@example.com',
    address: { zip: '20000-000', street: 'Av. B', number: '456', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ' }
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    fullName: 'Dr. Carlos Ferreira',
    crm: '12345-SP',
    specialty: 'Cardiologia',
    phone: '(11) 99999-8888',
    email: 'carlos.ferreira@clinic.com',
    availability: [
      { dayOfWeek: DayOfWeek.MONDAY, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: DayOfWeek.WEDNESDAY, startTime: '14:00', endTime: '18:00' },
    ]
  },
  {
    id: 'd2',
    fullName: 'Dra. Fernanda Lima',
    crm: '54321-RJ',
    specialty: 'Dermatologia',
    phone: '(21) 98888-7777',
    email: 'fernanda.lima@clinic.com',
    availability: [
      { dayOfWeek: DayOfWeek.TUESDAY, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: DayOfWeek.THURSDAY, startTime: '09:00', endTime: '17:00' },
    ]
  },
];

export const MOCK_CLINICS: Clinic[] = [
    {
        id: 'c1',
        name: 'Clínica Saúde Plena',
        cnpj: '12.345.678/0001-99',
        phone: '(11) 5555-1111',
        email: 'contato@saudeplena.com',
        address: { zip: '01234-567', street: 'Avenida Brasil', number: '1000', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP' }
    },
    {
        id: 'c2',
        name: 'Hospital Bem Estar',
        cnpj: '98.765.432/0001-11',
        phone: '(21) 5555-2222',
        email: 'contato@hospitalbemestar.com',
        address: { zip: '22345-890', street: 'Rua da Praia', number: '500', neighborhood: 'Botafogo', city: 'Rio de Janeiro', state: 'RJ' }
    }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    status: AppointmentStatus.SCHEDULED
  },
  {
    id: 'a2',
    patientId: 'p2',
    doctorId: 'd2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    status: AppointmentStatus.SCHEDULED
  },
  {
    id: 'a3',
    patientId: 'p1',
    doctorId: 'd2',
    dateTime: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    status: AppointmentStatus.COMPLETED
  },
];