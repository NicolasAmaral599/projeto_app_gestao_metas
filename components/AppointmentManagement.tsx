import React, { useState, useMemo } from 'react';
import { Appointment, Patient, Doctor, AppointmentStatus } from '../types';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from './Icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import ColumnFilter from './ColumnFilter';

type AppointmentTableColumn = 'dateTime' | 'patient' | 'doctor' | 'status' | 'actions';

const AppointmentForm: React.FC<{
  appointment?: Appointment | null;
  patients: Patient[];
  doctors: Doctor[];
  onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => void;
  onClose: () => void;
}> = ({ appointment, patients, doctors, onSave, onClose }) => {
  const [formData, setFormData] = useState(appointment || {
    patientId: '',
    doctorId: '',
    dateTime: '',
    status: AppointmentStatus.SCHEDULED,
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.dateTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    // Convert local datetime-local string to ISO string for consistency
    const appointmentToSave = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
    };
    onSave(appointmentToSave);
    onClose();
  };

  const inputStyles = "w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500";

  // Format date for datetime-local input
  const formattedDateTime = formData.dateTime ? new Date(new Date(formData.dateTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <select name="patientId" value={formData.patientId} onChange={handleChange} className={inputStyles} required>
            <option value="">Selecione o Paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </select>
        <select name="doctorId" value={formData.doctorId} onChange={handleChange} className={inputStyles} required>
            <option value="">Selecione o Médico</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName} - {d.specialty}</option>)}
        </select>
        <input type="datetime-local" name="dateTime" value={formattedDateTime} onChange={handleChange} className={inputStyles} required />
        {appointment && ( // Only show status for existing appointments
            <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                {Object.values(AppointmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        )}
        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Notas (opcional)" className={inputStyles} rows={3}></textarea>

        <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Salvar</button>
        </div>
    </form>
  );
};


const AppointmentManagement: React.FC<{
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onAdd: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  onUpdate: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}> = ({ appointments, patients, doctors, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<AppointmentTableColumn, { label: string; visible: boolean }>>({
    dateTime: { label: 'Data e Hora', visible: true },
    patient: { label: 'Paciente', visible: true },
    doctor: { label: 'Médico', visible: true },
    status: { label: 'Status', visible: true },
    actions: { label: 'Ações', visible: true },
  });

  const handleColumnToggle = (columnKey: AppointmentTableColumn) => {
    setColumnVisibility(prev => ({
        ...prev,
        [columnKey]: { ...prev[columnKey], visible: !prev[columnKey].visible }
    }));
  };

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName || 'N/A';
  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.fullName || 'N/A';

  const filteredAppointments = useMemo(() =>
    appointments.filter(a =>
      getPatientName(a.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDoctorName(a.doctorId).toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()),
  [appointments, searchTerm, patients, doctors]);

  const handleOpenModal = (appointment?: Appointment) => {
    setSelectedAppointment(appointment || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleSave = (appointmentData: Omit<Appointment, 'id'> | Appointment) => {
    if ('id' in appointmentData) {
      onUpdate(appointmentData as Appointment);
    } else {
      onAdd(appointmentData as Omit<Appointment, 'id' | 'status'>);
    }
  };
  
  const openConfirmDelete = (id: string) => {
    setAppointmentToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (appointmentToDelete) {
      onDelete(appointmentToDelete);
    }
    setIsConfirmOpen(false);
    setAppointmentToDelete(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por paciente ou médico..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-full w-full sm:w-64 bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
            <ColumnFilter columns={columnVisibility} onToggle={handleColumnToggle} />
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Novo Agendamento
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columnVisibility.dateTime.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Data e Hora</th>}
              {columnVisibility.patient.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Paciente</th>}
              {columnVisibility.doctor.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Médico</th>}
              {columnVisibility.status.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>}
              {columnVisibility.actions.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(app => (
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
                {columnVisibility.actions.visible && <td className="p-3 flex space-x-2">
                  <button onClick={() => handleOpenModal(app)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => openConfirmDelete(app.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
         {filteredAppointments.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum agendamento encontrado.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}>
        <AppointmentForm 
            appointment={selectedAppointment} 
            patients={patients} 
            doctors={doctors} 
            onSave={handleSave} 
            onClose={handleCloseModal} 
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja cancelar este agendamento?"
      />
    </div>
  );
};

export default AppointmentManagement;