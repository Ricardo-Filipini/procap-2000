import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { SunIcon, MoonIcon, UserIcon, KeyIcon } from './Icons';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('color-theme') || 'light');

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!pseudonym || !password) {
        setError('Pseudônimo e senha são obrigatórios.');
        setLoading(false);
        return;
    }

    try {
      // Check if user exists
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('pseudonym', pseudonym)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116: "object not found"
        throw selectError;
      }

      if (existingUser) {
        // User exists, check password
        if (existingUser.password === password) {
          onLogin(existingUser);
        } else {
          setError('Senha incorreta.');
        }
      } else {
        // User does not exist, create a new one
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({ pseudonym, password })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newUser) onLogin(newUser);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
       <div className="absolute top-4 right-4">
         <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
       </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                Procap<span className="text-blue-500">200</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sua plataforma de estudos para o Banco Central.</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">Acessar Plataforma</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="pseudonym">
                Pseudônimo
              </label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="pseudonym"
                  type="text"
                  value={pseudonym}
                  onChange={(e) => setPseudonym(e.target.value)}
                  className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                Senha
              </label>
               <div className="relative mt-1">
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  placeholder="********"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Entrando...' : 'Entrar / Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;