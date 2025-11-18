import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { Question } from './types';
import QuestionCard from './components/QuestionCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
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
    // Optional: could re-fetch or just shuffle existing questions
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5)); // simple shuffle
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Ocorreu um erro</h2>
          <p>{error}</p>
        </div>
      );
    }
    
    if (completed) {
        return (
            <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Parabéns!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Você completou todas as questões.</p>
                <button 
                    onClick={restartQuiz}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    Recomeçar
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
      <div className="text-center text-gray-500 dark:text-gray-400">
        <h2 className="text-2xl font-bold mb-4">Nenhuma questão encontrada</h2>
        <p>Não foi possível carregar as questões no momento.</p>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">Procap Study Platform</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Prepare-se para o Curso de Formação do Banco Central</p>
        </div>
      {renderContent()}
    </main>
  );
};

export default App;
