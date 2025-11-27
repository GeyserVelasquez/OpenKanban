export interface HistoryLogType {
  timestamp: number;
  userId: string;
  message: string;
}

export interface TagType {
  id: string;
  name: string;
  color: string;
}

export interface CommentType {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

export interface CardType {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: "low" | "medium" | "high";
  history: HistoryLogType[];
  tags: TagType[];
  comments: CommentType[];
}

export interface ColumnType {
  id: string;
  title: string;
  color: string;
  cards: CardType[];
}

export interface BoardType {
  id: string;
  name: string;
  backgroundColor: string;
  columns: ColumnType[];
  activityLog: HistoryLogType[];
}
