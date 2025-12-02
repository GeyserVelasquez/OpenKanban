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
  groupId?: string; // Optional for backward compatibility
  // folderId: string;
  createdAt?: number;
}

export interface GroupType {
  id: string;
  title: string;
  type: "group";
  boards: BoardType[];
  createdAt: number;
}

export interface WorkspaceData {
  groups: GroupType[];
  activeGroupId: string | null;
  activeBoardId: string | null;
}
