import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => boolean;
    onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="bg-primary-950 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-white mb-6">ClinicSys</h1>
            <h2 className="text-xl font-semibold text-center text-primary-200 mb-8">Bem-vindo de volta!</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-200">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-primary-800 border border-primary-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="seu@email.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-primary-200">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-primary-800 border border-primary-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Sua senha"
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Entrar
                    </button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-primary-300">
                Não tem uma conta?{' '}
                <button onClick={onNavigateToSignup} className="font-medium text-primary-300 hover:text-white">
                    Cadastre-se
                </button>
            </p>
        </div>
    );
};

export default LoginPage;