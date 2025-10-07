import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Sobre o ClinicSys
      </h1>
      <div className="text-gray-600 dark:text-gray-300 space-y-4">
        <p>
          O <strong>ClinicSys</strong> é uma solução moderna e intuitiva para a gestão completa de clínicas e consultórios médicos. Nosso sistema foi projetado para simplificar o dia a dia de profissionais de saúde e equipes administrativas, centralizando informações e otimizando processos.
        </p>
        <p>
          Nossa missão é oferecer uma ferramenta poderosa, porém fácil de usar, que permita o gerenciamento eficiente de pacientes, médicos, agendamentos e muito mais, tudo em um só lugar. Acreditamos que, ao reduzir a carga de trabalho administrativo, os profissionais podem dedicar mais tempo ao que realmente importa: o cuidado com o paciente.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 pt-4 border-t dark:border-gray-700">
          Recursos Principais
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Gestão de Pacientes:</strong> Cadastre e gerencie o histórico e as informações de contato dos seus pacientes de forma segura.</li>
          <li><strong>Gestão de Médicos:</strong> Organize os perfis dos profissionais, suas especialidades e horários de atendimento.</li>
          <li><strong>Gestão de Clínicas:</strong> Administre múltiplas unidades ou hospitais, centralizando a operação.</li>
          <li><strong>Agendamento Inteligente:</strong> Marque, visualize, reagende e cancele consultas com facilidade em uma interface de calendário clara.</li>
          <li><strong>Interface Personalizável:</strong> Alterne entre os modos claro e escuro para uma experiência visual mais confortável.</li>
          <li><strong>Controle de Acesso:</strong> Sistema de autenticação seguro para garantir a privacidade e a segurança dos dados.</li>
        </ul>
        <p className="pt-4">
          O ClinicSys está em constante evolução, buscando sempre incorporar novas tecnologias e feedbacks de nossos usuários para se tornar a melhor plataforma de gestão para a sua clínica.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;