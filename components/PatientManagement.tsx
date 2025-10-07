import React, { useState, useMemo } from 'react';
import { Patient } from '../types';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from './Icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import ColumnFilter from './ColumnFilter';

type PatientTableColumn = 'fullName' | 'cpf' | 'phone' | 'email' | 'actions';

const PatientForm: React.FC<{
  patient?: Patient | null;
  onSave: (patient: Omit<Patient, 'id'> | Patient) => void;
  onClose: () => void;
}> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState(patient || {
    fullName: '', cpf: '', birthDate: '', phone: '', email: '',
    // FIX: Add 'complement' to the initial state to match the Patient type and prevent a TypeScript error.
    address: { zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
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
            <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" className={inputStyles} required />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputStyles} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" className={inputStyles} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputStyles} />
        </div>
        <h3 className="text-lg font-medium border-t pt-4 mt-4 dark:text-gray-200 dark:border-gray-600">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="zip" value={formData.address.zip} onChange={handleAddressChange} placeholder="CEP" className={inputStyles} />
            <input name="street" value={formData.address.street} onChange={handleAddressChange} placeholder="Rua" className={inputStyles} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input name="number" value={formData.address.number} onChange={handleAddressChange} placeholder="Número" className={inputStyles} />
             <input name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} placeholder="Bairro" className={inputStyles} />
            <input name="complement" value={formData.address.complement || ''} onChange={handleAddressChange} placeholder="Complemento" className={inputStyles} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="city" value={formData.address.city} onChange={handleAddressChange} placeholder="Cidade" className={inputStyles} />
            <input name="state" value={formData.address.state} onChange={handleAddressChange} placeholder="Estado" className={inputStyles} />
        </div>

        <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Salvar</button>
        </div>
    </form>
  );
};


const PatientManagement: React.FC<{
  patients: Patient[];
  onAdd: (patient: Omit<Patient, 'id'>) => void;
  onUpdate: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}> = ({ patients, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<PatientTableColumn, { label: string; visible: boolean }>>({
    fullName: { label: 'Nome', visible: true },
    cpf: { label: 'CPF', visible: true },
    phone: { label: 'Telefone', visible: true },
    email: { label: 'Email', visible: true },
    actions: { label: 'Ações', visible: true },
  });

  const handleColumnToggle = (columnKey: PatientTableColumn) => {
    setColumnVisibility(prev => ({
        ...prev,
        [columnKey]: { ...prev[columnKey], visible: !prev[columnKey].visible }
    }));
  };

  const filteredPatients = useMemo(() =>
    patients.filter(p =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm)
    ), [patients, searchTerm]);

  const handleOpenModal = (patient?: Patient) => {
    setSelectedPatient(patient || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleSave = (patientData: Omit<Patient, 'id'> | Patient) => {
    if ('id' in patientData) {
      onUpdate(patientData as Patient);
    } else {
      onAdd(patientData);
    }
  };
  
  const openConfirmDelete = (id: string) => {
    setPatientToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (patientToDelete) {
      onDelete(patientToDelete);
    }
    setIsConfirmOpen(false);
    setPatientToDelete(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
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
              Adicionar Paciente
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columnVisibility.fullName.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Nome</th>}
              {columnVisibility.cpf.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">CPF</th>}
              {columnVisibility.phone.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Telefone</th>}
              {columnVisibility.email.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>}
              {columnVisibility.actions.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(p => (
              <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                {columnVisibility.fullName.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{p.fullName}</td>}
                {columnVisibility.cpf.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{p.cpf}</td>}
                {columnVisibility.phone.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{p.phone}</td>}
                {columnVisibility.email.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{p.email}</td>}
                {columnVisibility.actions.visible && <td className="p-3 flex space-x-2">
                  <button onClick={() => handleOpenModal(p)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => openConfirmDelete(p.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
         {filteredPatients.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum paciente encontrado.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedPatient ? 'Editar Paciente' : 'Adicionar Paciente'}>
        <PatientForm patient={selectedPatient} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default PatientManagement;