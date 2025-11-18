import React, { useState } from 'react';
import { QuestionNotebook } from '../types';
import { CubeIcon, BookOpenIcon, ChevronRightIcon } from './Icons';

interface StudySetupProps {
  notebooks: QuestionNotebook[];
  onStartRandom: (count: number) => void;
  onStartNotebook: (notebookId: string) => void;
}

const StudySetup: React.FC<StudySetupProps> = ({ notebooks, onStartRandom, onStartNotebook }) => {
  const [questionCount, setQuestionCount] = useState(40);

  const handleStartRandomClick = () => {
      if (questionCount > 0) {
          onStartRandom(questionCount);
      }
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Bloco Aleatório */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
            <CubeIcon className="h-8 w-8 text-blue-500" />
            <h2 className="ml-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Bloco Aleatório</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
            Crie uma sessão de estudo com um número personalizado de questões selecionadas aleatoriamente de todo o banco.
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-grow w-full sm:w-auto">
                <label htmlFor="question-count" className="sr-only">Número de questões</label>
                <input 
                    id="question-count"
                    type="number" 
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value, 10) || 0)}
                    min="1"
                    max="200"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                />
            </div>
            <button
                onClick={handleStartRandomClick}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-all duration-200 flex items-center justify-center group"
            >
                Iniciar Bloco
                <ChevronRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>

      {/* Seleção de Cadernos */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
            <BookOpenIcon className="h-8 w-8 text-green-500" />
            <h2 className="ml-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Estudar por Caderno</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
            Selecione um dos cadernos pré-definidos para focar em tópicos ou dificuldades específicas.
        </p>
        <div className="space-y-3">
            {notebooks.length > 0 ? (
                notebooks.map(notebook => (
                    <button
                        key={notebook.id}
                        onClick={() => onStartNotebook(notebook.id)}
                        className="w-full flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60 border dark:border-gray-700 transition-colors duration-200 group"
                    >
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">{notebook.name || 'Caderno sem nome'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{notebook.question_ids?.length || 0} questões</p>
                        </div>
                        <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum caderno encontrado.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudySetup;
