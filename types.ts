export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type Category = 
  | 'Authorship & Dating' 
  | 'Canon & Missing Books' 
  | 'Translation & Textual Issues' 
  | 'Historical & Cultural Context' 
  | 'Common Misconceptions' 
  | 'Mixed';

export type ComparativeSource = 
  | 'None'
  | 'Babylonian & Sumerian'
  | 'Egyptian & Book of Thoth'
  | 'Zoroastrian (Avesta)'
  | 'Canaanite & Ugaritic'
  | 'Eastern (Gita/Tao)'
  | 'Hellenistic & Greek'
  | 'Enoch & The Watchers'
  | 'Gnostic & Apocryphal'
  | 'Dead Sea Scrolls';

export interface Question {
  id: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  options: string[];
  correct_index: number;
  short_explanation: string;
  source_style_note: string;
}

export interface TriviaResponse {
  questions: Question[];
}

export interface GameSettings {
  count: number;
  difficulty: Difficulty;
  category: Category;
  comparativeSource: ComparativeSource;
}

export enum GameState {
  SETUP,
  LOADING,
  PLAYING,
  SUMMARY,
  ERROR
}