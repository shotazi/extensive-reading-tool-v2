export interface WordGroup {
  id: string;
  name: string;
  color: string;
  words: Set<string>;
  isSelected: boolean;
}

export interface WordData {
  word: string;
  groupId: string;
  examples: string[];
}

export type Language = 'en' | 'de' | 'ru';

export interface Flashcard {
  word: string;
  examples: string[];
}