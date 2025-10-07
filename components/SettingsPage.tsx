import React from 'react';

type Theme = 'light' | 'dark';

interface SettingsPageProps {
  theme: Theme;
  onThemeChange: (newTheme: Theme) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}> = ({ checked, onChange, label }) => {
    return (
        <label htmlFor={label} className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    id={label}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6 bg-primary-500' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                {label}
            </div>
        </label>
    );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onThemeChange, notificationsEnabled, onNotificationsToggle }) => {

  const handleThemeToggle = (isDark: boolean) => {
    onThemeChange(isDark ? 'dark' : 'light');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">Aparência</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300">
            Personalize a aparência do aplicativo para sua preferência.
          </p>
          <ToggleSwitch 
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
            label="Modo Escuro"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">Notificações</h2>
        <div className="flex justify-between items-center">
           <p className="text-gray-600 dark:text-gray-300">
            Receba alertas sobre seus agendamentos e outras atividades.
          </p>
          <ToggleSwitch
            checked={notificationsEnabled}
            onChange={onNotificationsToggle}
            label="Ativar Notificações"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;