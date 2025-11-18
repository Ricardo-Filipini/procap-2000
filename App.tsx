import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { Question, User } from './types';
import QuestionCard from './components/QuestionCard';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Leaderboard from './components/Leaderboard';
import { MenuIcon } from './components/Icons';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('study'); // study, leaderboard

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  
  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('procap_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setSessionLoaded(true);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem('procap_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('procap_user');
    setUser(null);
    setCurrentView('study');
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setCompleted(false);
    setCurrentIndex(0);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      if (data) setQuestions(data);

    } catch (err: any) {
      setError(err.message || 'Falha ao buscar questões.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && currentView === 'study') {
      fetchQuestions();
    }
  }, [user, currentView, fetchQuestions]);

  const handleAnswer = async (questionId: string, isCorrect: boolean) => {
    if (!user) return;

    // We only care about the first try for the leaderboard
    const { data: existingAnswer } = await supabase
        .from('user_question_answers')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .eq('notebook_id', 'all_questions')
        .single();
    
    if (existingAnswer) return; // Already answered

    await supabase.from('user_question_answers').insert({
      user_id: user.id,
      question_id: questionId,
      notebook_id: 'all_questions',
      is_correct_first_try: isCorrect,
    });
  };

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

  const renderStudyContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (completed) {
        return (
            <div className="text-center bg-white dark:bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Parabéns!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Você completou este bloco de estudos.</p>
                <button 
                    onClick={fetchQuestions}
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
          onAnswer={handleAnswer}
        />
      );
    }
    return <div className="text-center text-gray-500">Nenhuma questão encontrada.</div>;
  };
  
  if (!sessionLoaded) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={handleLogout}
        setCurrentView={setCurrentView}
        currentView={currentView}
        user={user}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <MenuIcon className="h-6 w-6" />
           </button>
           <h1 className="ml-4 text-xl font-semibold">
              {currentView === 'study' ? 'Estudo: Todas as Questões' : 'Leaderboard Geral'}
           </h1>
        </header>
        <main className="flex-grow p-4 sm:p-6 md:p-8 flex items-center justify-center">
          {currentView === 'study' && renderStudyContent()}
          {currentView === 'leaderboard' && <Leaderboard />}
        </main>
      </div>
    </div>
  );
};

export default App;