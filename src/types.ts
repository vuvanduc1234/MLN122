export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // 0-indexed for options (0 for A, 1 for B, 2 for C, 3 for D)
  explanation?: string;
  isLucky: boolean;
}

export type PrizeType = 'CANDY' | '5K' | '10K';

export interface CardState {
  id: number; // Card position 1 to 24
  question: Question;
  prize: PrizeType;
  isOpened: boolean; // Has the card been flipped/revealed?
  isCompleted: boolean; // Has the card been successfully answered and prize awarded?
}
