import React, { useState, useCallback, useEffect } from 'react';
import { Patient, Doctor, Appointment, ViewType, AppointmentStatus, Clinic } from './types';
import { MOCK_PATIENTS, MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_CLINICS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import ClinicManagement from './components/ClinicManagement';
import AboutPage from './components/AboutPage';

// Mock user type for demonstration
interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Password should not be stored in frontend state in a real app
}

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [clinics, setClinics] = useState<Clinic[]>(MOCK_CLINICS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Settings state
  const [theme, setTheme] = useState<Theme>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);


  const handleAddPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patient, id: `p${Date.now()}` };
    setPatients(prev => [...prev, newPatient]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  const handleAddDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = { ...doctor, id: `d${Date.now()}` };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
  };

  const handleDeleteDoctor = (doctorId: string) => {
    setDoctors(prev => prev.filter(d => d.id !== doctorId));
  };

  const handleAddClinic = (clinic: Omit<Clinic, 'id'>) => {
    const newClinic: Clinic = { ...clinic, id: `c${Date.now()}` };
    setClinics(prev => [...prev, newClinic]);
  };

  const handleUpdateClinic = (updatedClinic: Clinic) => {
    setClinics(prev => prev.map(c => c.id === updatedClinic.id ? updatedClinic : c));
  };

  const handleDeleteClinic = (clinicId: string) => {
    setClinics(prev => prev.filter(c => c.id !== clinicId));
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = { 
      ...appointment, 
      id: `a${Date.now()}`, 
      status: AppointmentStatus.SCHEDULED 
    };
    setAppointments(prev => [...prev, newAppointment]);
  };
  
  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
  };

  // --- Auth Handlers ---
  const handleLogin = (email: string, password: string):boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    alert('Invalid credentials');
    return false;
  };

  const handleSignup = (fullName: string, email: string, password: string) => {
    if (users.some(u => u.email === email)) {
      alert('User with this email already exists.');
      return;
    }
    const newUser: User = { id: `u${Date.now()}`, fullName, email, password };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView('dashboard'); // Reset to default view on logout
  };

  const handleUpdateUser = (updatedInfo: { fullName: string; email: string }) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedInfo };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedInfo } : u));
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!currentUser) return false;
    const userInDb = users.find(u => u.id === currentUser.id);
    if (userInDb && userInDb.password === currentPassword) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u));
      alert('Password changed successfully!');
      return true;
    } else {
      alert('Incorrect current password.');
      return false;
    }
  };

  // --- Settings Handlers ---
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
  };

  const renderView = useCallback(() => {
    switch (view) {
      case 'patients':
        return <PatientManagement 
          patients={patients} 
          onAdd={handleAddPatient} 
          onUpdate={handleUpdatePatient} 
          onDelete={handleDeletePatient} 
        />;
      case 'doctors':
        return <DoctorManagement
          doctors={doctors}
          onAdd={handleAddDoctor}
          onUpdate={handleUpdateDoctor}
          onDelete={handleDeleteDoctor}
        />;
      case 'clinics':
        return <ClinicManagement
          clinics={clinics}
          onAdd={handleAddClinic}
          onUpdate={handleUpdateClinic}
          onDelete={handleDeleteClinic}
        />;
      case 'appointments':
        return <AppointmentManagement 
          appointments={appointments}
          patients={patients}
          doctors={doctors}
          onAdd={handleAddAppointment}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />;
      case 'profile':
        return currentUser ? (
          <ProfilePage 
            user={currentUser} 
            onUpdateProfile={handleUpdateUser}
            onChangePassword={handleChangePassword}
          />
        ) : null;
      case 'settings':
        return <SettingsPage
          theme={theme}
          onThemeChange={handleThemeChange}
          notificationsEnabled={notificationsEnabled}
          onNotificationsToggle={handleNotificationsToggle}
        />;
      case 'about':
        return <AboutPage />;
      case 'dashboard':
      default:
        return <Dashboard appointments={appointments} patients={patients} doctors={doctors} />;
    }
  }, [view, patients, doctors, clinics, appointments, currentUser, theme, notificationsEnabled]);

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen bg-primary-900 flex items-center justify-center">
        {authView === 'login' ? (
          <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setAuthView('signup')} />
        ) : (
          <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <Layout activeView={view} setView={setView} onLogout={handleLogout} user={currentUser}>
      {renderView()}
    </Layout>
  );
};

export default App;