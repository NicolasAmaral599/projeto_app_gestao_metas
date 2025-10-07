import React, { ReactNode } from 'react';
import { ViewType } from '../types';
import { DashboardIcon, PatientIcon, DoctorIcon, CalendarIcon, UserIcon, LogoutIcon, ProfileIcon, SettingsIcon, ClinicIcon, AboutIcon } from './Icons';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface LayoutProps {
  children: ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
  user: User | null;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-gray-200 hover:bg-primary-800 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onLogout, user }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-primary-700 text-white">
        <div className="flex items-center justify-center h-20 shadow-md bg-primary-800">
          <h1 className="text-2xl font-bold tracking-wider">ClinicSys</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavItem
            icon={<DashboardIcon className="w-6 h-6" />}
            label="Dashboard"
            isActive={activeView === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <NavItem
            icon={<PatientIcon className="w-6 h-6" />}
            label="Pacientes"
            isActive={activeView === 'patients'}
            onClick={() => setView('patients')}
          />
          <NavItem
            icon={<DoctorIcon className="w-6 h-6" />}
            label="Médicos"
            isActive={activeView === 'doctors'}
            onClick={() => setView('doctors')}
          />
          <NavItem
            icon={<ClinicIcon className="w-6 h-6" />}
            label="Clínicas"
            isActive={activeView === 'clinics'}
            onClick={() => setView('clinics')}
          />
          <NavItem
            icon={<CalendarIcon className="w-6 h-6" />}
            label="Agendamentos"
            isActive={activeView === 'appointments'}
            onClick={() => setView('appointments')}
          />
           <NavItem
            icon={<ProfileIcon className="w-6 h-6" />}
            label="Perfil"
            isActive={activeView === 'profile'}
            onClick={() => setView('profile')}
          />
           <NavItem
            icon={<AboutIcon className="w-6 h-6" />}
            label="Sobre"
            isActive={activeView === 'about'}
            onClick={() => setView('about')}
          />
           <NavItem
            icon={<SettingsIcon className="w-6 h-6" />}
            label="Configurações"
            isActive={activeView === 'settings'}
            onClick={() => setView('settings')}
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 capitalize">{activeView}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.fullName}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Logout"
                >
                  <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;