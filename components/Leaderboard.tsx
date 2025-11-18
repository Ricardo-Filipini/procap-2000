import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import LoadingSpinner from './LoadingSpinner';
import { TrophyIcon } from './Icons';

interface LeaderboardEntry {
  pseudonym: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: answers, error: answersError } = await supabase
          .from('user_question_answers')
          .select('user_id, is_correct_first_try')
          .eq('is_correct_first_try', true);

        if (answersError) throw answersError;

        const scores: { [key: string]: number } = {};
        if (answers) {
            for (const answer of answers) {
                if(answer.user_id) {
                    scores[answer.user_id] = (scores[answer.user_id] || 0) + 1;
                }
            }
        }
        
        const userIds = Object.keys(scores);
        if (userIds.length === 0) {
            setLeaderboard([]);
            setLoading(false);
            return;
        }

        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, pseudonym')
          .in('id', userIds);

        if (usersError) throw usersError;

        const board = users.map(user => ({
          pseudonym: user.pseudonym,
          score: scores[user.id] || 0,
        })).sort((a, b) => b.score - a.score);

        setLeaderboard(board);
      } catch (err: any) {
        setError(err.message || 'Falha ao buscar o leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-yellow-600';
    return 'text-gray-500 dark:text-gray-400';
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-3xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Leaderboard Geral</h2>
      
      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma pontuação registrada ainda. Responda algumas questões!</p>
      ) : (
        <ul className="space-y-3">
          {leaderboard.map((entry, index) => (
            <li key={entry.pseudonym} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
              <div className="flex items-center">
                <span className={`w-8 text-lg font-bold ${getRankColor(index)}`}>{index + 1}</span>
                <p className="font-semibold ml-4 text-gray-700 dark:text-gray-200">{entry.pseudonym}</p>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-lg text-blue-500">{entry.score}</span>
                <TrophyIcon className={`h-5 w-5 ml-2 ${getRankColor(index)}`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
