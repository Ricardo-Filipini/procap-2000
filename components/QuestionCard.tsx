import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
}

const difficultyColorMap = {
  'Fácil': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Médio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Difícil': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, totalQuestions, onNext, onPrev, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    const correct = selectedOption === question.correct_answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if(question.id){
        onAnswer(question.id, correct);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60';
    }

    const isCorrectOption = option === question.correct_answer;
    if (isCorrectOption) {
      return 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 ring-2 ring-green-500';
    }

    if (selectedOption === option) {
      return 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 ring-2 ring-red-500';
    }

    return 'bg-white dark:bg-gray-800 opacity-60';
  };
  
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-3xl border border-gray-200 dark:border-gray-700">
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <p>Questão {questionNumber} de {totalQuestions}</p>
            {question.difficulty && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyColorMap[question.difficulty] || 'bg-gray-100 text-gray-800'}`}>
                    {question.difficulty}
                </span>
            )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>


      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">{question.question_text}</h2>

      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const cleanOption = option.substring(option.indexOf(')') + 1).trim();
          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border dark:border-gray-600/20 transition-all duration-200 flex items-center space-x-4 ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer' : ''}`}
            >
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center font-bold text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{String.fromCharCode(65 + index)}</span>
              <span className="flex-1 text-gray-700 dark:text-gray-300">{cleanOption}</span>
               {isAnswered && option === question.correct_answer && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
               {isAnswered && selectedOption === option && option !== question.correct_answer && <XCircleIcon className="h-6 w-6 text-red-500" />}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400"/>
            Explicação
            </h3>
          <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {!isAnswered ? (
          <div className="w-full flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-500 transition-all duration-200 flex items-center group"
            >
              Confirmar Resposta
              <ChevronRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onPrev}
              disabled={questionNumber === 1}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Anterior
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center group"
            >
              {questionNumber === totalQuestions ? 'Finalizar' : 'Próxima'}
              <ChevronRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;