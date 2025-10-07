import React, { useState, useMemo } from 'react';
import { Clinic } from '../types';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from './Icons';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import ColumnFilter from './ColumnFilter';

type ClinicTableColumn = 'name' | 'cnpj' | 'phone' | 'email' | 'actions';

const ClinicForm: React.FC<{
  clinic?: Clinic | null;
  onSave: (clinic: Omit<Clinic, 'id'> | Clinic) => void;
  onClose: () => void;
}> = ({ clinic, onSave, onClose }) => {
  const [formData, setFormData] = useState(clinic || {
    name: '', cnpj: '', phone: '', email: '',
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
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome da Clínica/Hospital" className={inputStyles} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" className={inputStyles} required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" className={inputStyles} />
        </div>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email de Contato" className={inputStyles} />
        
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


const ClinicManagement: React.FC<{
  clinics: Clinic[];
  onAdd: (clinic: Omit<Clinic, 'id'>) => void;
  onUpdate: (clinic: Clinic) => void;
  onDelete: (clinicId: string) => void;
}> = ({ clinics, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinicToDelete, setClinicToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<ClinicTableColumn, { label: string; visible: boolean }>>({
    name: { label: 'Nome', visible: true },
    cnpj: { label: 'CNPJ', visible: true },
    phone: { label: 'Telefone', visible: true },
    email: { label: 'Email', visible: true },
    actions: { label: 'Ações', visible: true },
  });

  const handleColumnToggle = (columnKey: ClinicTableColumn) => {
    setColumnVisibility(prev => ({
        ...prev,
        [columnKey]: { ...prev[columnKey], visible: !prev[columnKey].visible }
    }));
  };

  const filteredClinics = useMemo(() =>
    clinics.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cnpj.includes(searchTerm)
    ), [clinics, searchTerm]);

  const handleOpenModal = (clinic?: Clinic) => {
    setSelectedClinic(clinic || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedClinic(null);
    setIsModalOpen(false);
  };

  const handleSave = (clinicData: Omit<Clinic, 'id'> | Clinic) => {
    if ('id' in clinicData) {
      onUpdate(clinicData as Clinic);
    } else {
      onAdd(clinicData);
    }
  };
  
  const openConfirmDelete = (id: string) => {
    setClinicToDelete(id);
    setIsConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (clinicToDelete) {
      onDelete(clinicToDelete);
    }
    setIsConfirmOpen(false);
    setClinicToDelete(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
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
              Adicionar Clínica
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columnVisibility.name.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Nome</th>}
              {columnVisibility.cnpj.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">CNPJ</th>}
              {columnVisibility.phone.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Telefone</th>}
              {columnVisibility.email.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>}
              {columnVisibility.actions.visible && <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredClinics.map(c => (
              <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                {columnVisibility.name.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{c.name}</td>}
                {columnVisibility.cnpj.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{c.cnpj}</td>}
                {columnVisibility.phone.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{c.phone}</td>}
                {columnVisibility.email.visible && <td className="p-3 text-gray-700 dark:text-gray-300">{c.email}</td>}
                {columnVisibility.actions.visible && <td className="p-3 flex space-x-2">
                  <button onClick={() => handleOpenModal(c)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => openConfirmDelete(c.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
         {filteredClinics.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma clínica encontrada.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedClinic ? 'Editar Clínica' : 'Adicionar Clínica'}>
        <ClinicForm clinic={selectedClinic} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja excluir esta clínica? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ClinicManagement;