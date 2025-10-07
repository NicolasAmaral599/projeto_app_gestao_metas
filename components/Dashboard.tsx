import React, { useState } from 'react';
import { Appointment, Patient, Doctor, AppointmentStatus } from '../types';
import { CalendarIcon, DoctorIcon, PatientIcon } from './Icons';
import ColumnFilter from './ColumnFilter';

interface DashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}

type DashboardTableColumn = 'dateTime' | 'patient' | 'doctor' | 'status';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center`}>
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ appointments, patients, doctors }) => {
    const [columnVisibility, setColumnVisibility] = useState<Record<DashboardTableColumn, { label: string; visible: boolean }>>({
        dateTime: { label: 'Data e Hora', visible: true },
        patient: { label: 'Paciente', visible: true },
        doctor: { label: 'Médico', visible: true },
        status: { label: 'Status', visible: true },
    });

    const handleColumnToggle = (columnKey: DashboardTableColumn) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnKey]: { ...prev[columnKey], visible: !prev[columnKey].visible }
        }));
    };
    
    const upcomingAppointments = appointments
        .filter(a => new Date(a.dateTime) > new Date() && a.status === AppointmentStatus.SCHEDULED)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .slice(0, 5);

    const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName || 'N/A';
    const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.fullName || 'N/A';

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={<PatientIcon className="w-6 h-6 text-white" />}
                    label="Total de Pacientes"
                    value={patients.length}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<DoctorIcon className="w-6 h-6 text-white" />}
                    label="Total de Médicos"
                    value={doctors.length}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<CalendarIcon className="w-6 h-6 text-white" />}
                    label="Agendamentos Próximos"
                    value={upcomingAppointments.length}
                    color="bg-purple-500"
                />
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Próximos Agendamentos</h2>
                    <ColumnFilter columns={columnVisibility} onToggle={handleColumnToggle} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {columnVisibility.dateTime.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Data e Hora</th>}
                                {columnVisibility.patient.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Paciente</th>}
                                {columnVisibility.doctor.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Médico</th>}
                                {columnVisibility.status.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map(app => (
                                    <tr key={app.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {columnVisibility.dateTime.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(app.dateTime).toLocaleString('pt-BR')}</td>}
                                        {columnVisibility.patient.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{getPatientName(app.patientId)}</td>}
                                        {columnVisibility.doctor.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{getDoctorName(app.doctorId)}</td>}
                                        {columnVisibility.status.visible && <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                app.status === AppointmentStatus.SCHEDULED ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                app.status === AppointmentStatus.COMPLETED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {/* FIX: Explicitly type 'c' to work around a TypeScript inference issue with Object.values. */}
                                    <td colSpan={Object.values(columnVisibility).filter((c: { visible: boolean }) => c.visible).length} className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        Nenhum agendamento próximo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;