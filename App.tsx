import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { Question } from './types';
import QuestionCard from './components/QuestionCard';
import LoadingSpinner from './components/LoadingSpinner';
import { SunIcon, MoonIcon } from './components/Icons';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('color-theme') || 'light');

  useEffect(() => {
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

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setQuestions(data);
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar questões.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const restartQuiz = () => {
    setCurrentIndex(0);
    setCompleted(false);
    // Shuffle and refetch for a new set of questions, or just reshuffle existing
    fetchQuestions(); 
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl shadow-lg border border-red-200 dark:border-red-800">
          <h2 className="text-2xl font-bold mb-4">Ocorreu um erro</h2>
          <p>{error}</p>
           <button 
              onClick={fetchQuestions}
              className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
              Tentar Novamente
          </button>
        </div>
      );
    }
    
    if (completed) {
        return (
            <div className="text-center bg-white dark:bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Parabéns!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Você completou este bloco de estudos.</p>
                <button 
                    onClick={restartQuiz}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    Começar um Novo Bloco
                </button>
            </div>
        )
    }

    if (questions.length > 0) {
      return (
        <QuestionCard
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onNext={handleNextQuestion}
          onPrev={handlePreviousQuestion}
        />
      );
    }

    return (
      <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Nenhuma questão encontrada</h2>
        <p>Não foi possível carregar as questões no momento.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            Procap<span className="text-blue-500">200</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
      </header>
      <main className="flex-grow flex items-center justify-center">
          <div className="w-full transition-opacity duration-300">
             {renderContent()}
          </div>
      </main>
      <footer className="w-full max-w-5xl mx-auto text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Plataforma de estudos para o Curso de Formação do Banco Central.
        </p>
      </footer>
    </div>
  );
};

export default App;