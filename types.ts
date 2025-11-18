
export interface Question {
  id: string;
  source_id: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | string | null;
  question_text: string | null;
  options: string[] | null;
  correct_answer: string | null;
  explanation: string | null;
  hints: string[] | null;
  comments: any[] | null;
  hot_votes: number;
  cold_votes: number;
}

export interface User {
  id: string;
  pseudonym: string;
  created_at: string;
  level: number;
  xp: number;
  achievements: string[];
  stats: any;
}
