import React, { useState, useMemo } from 'react';
import { Doctor, DayOfWeek, Availability } from '../types';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from './Icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import ColumnFilter from './ColumnFilter';

type DoctorTableColumn = 'fullName' | 'specialty' | 'crm' | 'phone' | 'actions';

const DoctorForm: React.FC<{
  doctor?: Doctor | null;
  onSave: (doctor: Omit<Doctor, 'id'> | Doctor) => void;
  onClose: () => void;
}> = ({ doctor, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Doctor, 'id'> | Doctor>(doctor || {
    fullName: '', crm: '', specialty: '', phone: '', email: '', availability: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (index: number, field: keyof Availability, value: string) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData(prev => ({ ...prev, availability: newAvailability }));
  };

  const addAvailabilitySlot = () => {
    setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, { dayOfWeek: DayOfWeek.MONDAY, startTime: '08:00', endTime: '12:00' }]
    }));
  };

  const removeAvailabilitySlot = (index: number) => {
    const newAvailability = formData.availability.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, availability: newAvailability}));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputStyles = "w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nome Completo" className={inputStyles} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="crm" value={formData.crm} onChange={handleChange} placeholder="CRM" className={inputStyles} required />
            <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Especialidade" className={inputStyles} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" className={inputStyles} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputStyles} />
        </div>
        
        <h3 className="text-lg font-medium border-t pt-4 mt-4 dark:text-gray-200 dark:border-gray-600">Disponibilidade</h3>
        <div className="space-y-2">
            {formData.availability.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <select
                        value={slot.dayOfWeek}
                        onChange={(e) => handleAvailabilityChange(index, 'dayOfWeek', e.target.value)}
                        className={inputStyles}
                    >
                        {Object.values(DayOfWeek).map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <input type="time" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)} className={inputStyles} />
                    <input type="time" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)} className={inputStyles} />
                    <button type="button" onClick={() => removeAvailabilitySlot(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
        </div>
        <button type="button" onClick={addAvailabilitySlot} className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
            + Adicionar Horário
        </button>

        <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Salvar</button>
        </div>
    </form>
  );
};


const DoctorManagement: React.FC<{
  doctors: Doctor[];
  onAdd: (doctor: Omit<Doctor, 'id'>) => void;
  onUpdate: (doctor: Doctor) => void;
  onDelete: (doctorId: string) => void;
}> = ({ doctors, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<DoctorTableColumn, { label: string; visible: boolean }>>({
    fullName: { label: 'Nome', visible: true },
    specialty: { label: 'Especialidade', visible: true },
    crm: { label: 'CRM', visible: true },
    phone: { label: 'Telefone', visible: true },
    actions: { label: 'Ações', visible: true },
  });

  const handleColumnToggle = (columnKey: DoctorTableColumn) => {
    setColumnVisibility(prev => ({
        ...prev,
        [columnKey]: { ...prev[columnKey], visible: !prev[columnKey].visible }
    }));
  };

  const filteredDoctors = useMemo(() =>
    doctors.filter(d =>
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ), [doctors, searchTerm]);

  const handleOpenModal = (doctor?: Doctor) => {
    setSelectedDoctor(doctor || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  const handleSave = (doctorData: Omit<Doctor, 'id'> | Doctor) => {
    if ('id' in doctorData) {
      onUpdate(doctorData as Doctor);
    } else {
      onAdd(doctorData);
    }
  };
  
  const openConfirmDelete = (id: string) => {
    setDoctorToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (doctorToDelete) {
      onDelete(doctorToDelete);
    }
    setIsConfirmOpen(false);
    setDoctorToDelete(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou especialidade..."
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
              Adicionar Médico
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columnVisibility.fullName.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Nome</th>}
              {columnVisibility.specialty.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Especialidade</th>}
              {columnVisibility.crm.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">CRM</th>}
              {columnVisibility.phone.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Telefone</th>}
              {columnVisibility.actions.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(d => (
              <tr key={d.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                {columnVisibility.fullName.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{d.fullName}</td>}
                {columnVisibility.specialty.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{d.specialty}</td>}
                {columnVisibility.crm.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{d.crm}</td>}
                {columnVisibility.phone.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{d.phone}</td>}
                {columnVisibility.actions.visible && <td className="p-3 flex space-x-2">
                  <button onClick={() => handleOpenModal(d)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => openConfirmDelete(d.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum médico encontrado.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedDoctor ? 'Editar Médico' : 'Adicionar Médico'}>
        <DoctorForm doctor={selectedDoctor} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default DoctorManagement;