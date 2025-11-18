import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from './Icons';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
}

const difficultyColorMap = {
  'Fácil': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Médio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Difícil': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, onNext, onPrev }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900'
        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
    }

    const isCorrect = option === question.correct_answer;
    if (isCorrect) {
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 ring-2 ring-green-500';
    }

    if (selectedOption === option) {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 ring-2 ring-red-500';
    }

    return 'bg-white dark:bg-gray-700';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-3xl transition-shadow duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Questão {questionNumber} de {totalQuestions}</p>
        {question.difficulty && (
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyColorMap[question.difficulty] || 'bg-gray-100 text-gray-800'}`}>
            {question.difficulty}
          </span>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">{question.question_text}</h2>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border dark:border-gray-600 transition-all duration-200 flex items-center space-x-4 ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <span className="font-bold text-blue-600 dark:text-blue-400">{String.fromCharCode(65 + index)}</span>
            <span className="flex-1 text-gray-700 dark:text-gray-300">{option.substring(option.indexOf(')') + 1).trim()}</span>
             {isAnswered && option === question.correct_answer && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
             {isAnswered && selectedOption === option && option !== question.correct_answer && <XCircleIcon className="h-6 w-6 text-red-500" />}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500"/>
            Explicação
            </h3>
          <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        {!isAnswered ? (
          <div className="w-full flex justify-end">
            <button
              onClick={() => setIsAnswered(true)}
              disabled={!selectedOption}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-colors duration-200"
            >
              Confirmar Resposta
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onPrev}
              disabled={questionNumber === 1}
              className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Anterior
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              {questionNumber === totalQuestions ? 'Finalizar' : 'Próxima Questão'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
