export interface Player {
  id: string;
  name: string;
  score: number;
  guesses: { word: string; correct: boolean }[];
}

export type CategoryId = 'mafia' | 'funny' | 'jobs' | 'animals' | 'objects' | 'superheroes';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  words: string[];
}

export interface GameSettings {
  timeLimit: number; // in seconds
  rounds: number;
  selectedCategories: CategoryId[];
}

export type GameState = 'WELCOME' | 'SETTINGS' | 'PREPARATION' | 'COUNTDOWN' | 'PLAYING' | 'TURN_END' | 'LEADERBOARD';
