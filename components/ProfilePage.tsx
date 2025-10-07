import React, { useState, useEffect } from 'react';
import { EditIcon } from './Icons';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface ProfilePageProps {
  user: User;
  onUpdateProfile: (updatedInfo: { fullName: string; email: string; }) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, onChangePassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: user.fullName, email: user.email });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData({ fullName: user.fullName, email: user.email });
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match.");
      return;
    }
    const success = onChangePassword(passwordData.currentPassword, passwordData.newPassword);
    if(success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleCancelEdit = () => {
    setFormData({ fullName: user.fullName, email: user.email });
    setIsEditing(false);
  }

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";
  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Details Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Detalhes do Perfil</h2>
          {!isEditing && (
             <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                <EditIcon className="w-4 h-4 mr-1" /> Editar
             </button>
          )}
        </div>
        
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nome Completo</label>
              <p className="text-lg text-gray-800 dark:text-gray-100">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <p className="text-lg text-gray-800 dark:text-gray-100">{user.email}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="fullName" className={labelStyles}>Nome Completo</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleProfileChange}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={labelStyles}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                className={inputStyles}
                required
              />
            </div>
            <div className="flex justify-end pt-2 space-x-2">
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Salvar Alterações</button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">Alterar Senha</h2>
         <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
                <label htmlFor="currentPassword" className={labelStyles}>Senha Atual</label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={inputStyles}
                    placeholder="Sua senha atual"
                    required
                />
            </div>
             <div>
                <label htmlFor="newPassword" className={labelStyles}>Nova Senha</label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={inputStyles}
                    placeholder="Crie uma nova senha"
                    required
                />
            </div>
             <div>
                <label htmlFor="confirmPassword" className={labelStyles}>Confirmar Nova Senha</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputStyles}
                    placeholder="Confirme a nova senha"
                    required
                />
            </div>
            <div className="flex justify-end pt-2">
                <button type="submit" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Alterar Senha</button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default ProfilePage;