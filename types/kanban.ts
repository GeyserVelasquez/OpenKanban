export type Priority = 'low' | 'medium' | 'high';

export interface CardType {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
}

export interface ColumnType {
  id: string;
  title: string;
  cards: CardType[];
}

export interface BoardType {
  id: string;
  name: string;
  backgroundColor: string;
  columns: ColumnType[];
}

export type ThemeType = 'light' | 'dark' | 'playful';
