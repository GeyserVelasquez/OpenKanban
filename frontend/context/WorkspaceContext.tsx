"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BoardType, GroupType, WorkspaceData, ColumnType, HistoryLogType } from "@/types/kanban";

import { useAuth } from "@/context/AuthContext";

const createHistoryLog = (message: string, userId: string): HistoryLogType => ({
  timestamp: Date.now(),
  userId: userId,
  message,
});

const createDefaultColumns = (): ColumnType[] => {
  const timestamp = Date.now();
  return [
    {
      id: `col-${timestamp}-1`,
      title: "Pendiente",
      color: "bg-slate-200 dark:bg-gray-700",
      cards: [],
    },
    {
      id: `col-${timestamp}-2`,
      title: "En Proceso",
      color: "bg-blue-200 dark:bg-blue-900/40",
      cards: [],
    },
    {
      id: `col-${timestamp}-3`,
      title: "Hecho",
      color: "bg-green-200 dark:bg-green-900/40",
      cards: [],
    },
  ];
};

interface WorkspaceContextType {
  workspace: WorkspaceData;
  createGroup: (title: string) => string;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, newTitle: string) => void;
  createBoard: (groupId: string, title: string) => string;
  deleteBoard: (boardId: string) => void;
  renameBoard: (boardId: string, newTitle: string) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoard: () => BoardType | null;
  updateBoard: (boardId: string, data: Partial<BoardType>) => void;
  getAllBoards: () => BoardType[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const { user } = useAuth();
  const currentUserId = user?.id || "anonymous";

  const [workspace, setWorkspace] = useState<WorkspaceData>({
    groups: [],
    activeGroupId: null,
    activeBoardId: null,
  });

  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedWorkspace = localStorage.getItem("OPENKANBAN_WORKSPACE");
    
    if (savedWorkspace) {
      try {
        const parsed = JSON.parse(savedWorkspace);
        setWorkspace(parsed);
      } catch (error) {
        console.error("Error parsing workspace data:", error);
      }
    } else {
      // Check for old data format and migrate
      const oldBoard = localStorage.getItem("OPENKANBAN_BOARD");
      if (oldBoard) {
        try {
          const parsedOldBoard = JSON.parse(oldBoard);
          // Create default group and migrate old board
          const defaultGroup: GroupType = {
            id: `group-${Date.now()}`,
            title: "Mi Workspace",
            type: "group",
            boards: [{
              ...parsedOldBoard,
              groupId: `group-${Date.now()}`,
              createdAt: Date.now(),
            }],
            createdAt: Date.now(),
          };
          
          const newWorkspace: WorkspaceData = {
            groups: [defaultGroup],
            activeGroupId: defaultGroup.id,
            activeBoardId: parsedOldBoard.id,
          };
          
          setWorkspace(newWorkspace);
          localStorage.setItem("OPENKANBAN_WORKSPACE", JSON.stringify(newWorkspace));
        } catch (error) {
          console.error("Error migrating old board data:", error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever workspace changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("OPENKANBAN_WORKSPACE", JSON.stringify(workspace));
  }, [workspace, mounted]);

  const createGroup = (title: string): string => {
    const newGroup: GroupType = {
      id: `group-${Date.now()}`,
      title,
      type: "group",
      boards: [],
      createdAt: Date.now(),
    };

    setWorkspace((prev) => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      activeGroupId: prev.groups.length === 0 ? newGroup.id : prev.activeGroupId,
    }));

    return newGroup.id;
  };

  const deleteGroup = (groupId: string) => {
    setWorkspace((prev) => {
      const groupToDelete = prev.groups.find((g) => g.id === groupId);
      const newGroups = prev.groups.filter((g) => g.id !== groupId);
      const wasActive = prev.activeGroupId === groupId;
      
      // Check if the active board belongs to the group being deleted
      const activeBoardInDeletedGroup = groupToDelete?.boards.some(
        (b) => b.id === prev.activeBoardId
      );
      
      return {
        ...prev,
        groups: newGroups,
        activeGroupId: wasActive && newGroups.length > 0 ? newGroups[0].id : null,
        activeBoardId: activeBoardInDeletedGroup ? null : prev.activeBoardId,
      };
    });
  };

  const renameGroup = (groupId: string, newTitle: string) => {
    setWorkspace((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId ? { ...g, title: newTitle } : g
      ),
    }));
  };

  const createBoard = (groupId: string, title: string): string => {
    const newBoard: BoardType = {
      id: `board-${Date.now()}`,
      name: title,
      backgroundColor: "bg-gray-100 dark:bg-gray-800",
      columns: createDefaultColumns(),
      activityLog: [createHistoryLog("Tablero creado", currentUserId)],
      groupId,
      createdAt: Date.now(),
      createdBy: currentUserId,
      members: [{
        id: currentUserId,
        username: user?.name || "Usuario",
        name: user?.name || "Usuario",
        role: "owner",
        joinedAt: Date.now(),
        avatar: user?.avatar
      }]
    };

    setWorkspace((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId
          ? { ...g, boards: [...g.boards, newBoard] }
          : g
      ),
      activeBoardId: prev.activeBoardId || newBoard.id,
    }));

    return newBoard.id;
  };

  const deleteBoard = (boardId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => ({
        ...g,
        boards: g.boards.filter((b) => b.id !== boardId),
      })),
      activeBoardId: prev.activeBoardId === boardId ? null : prev.activeBoardId,
    }));
  };

  const renameBoard = (boardId: string, newTitle: string) => {
    setWorkspace((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => ({
        ...g,
        boards: g.boards.map((b) =>
          b.id === boardId ? { ...b, name: newTitle } : b
        ),
      })),
    }));
  };

  const setActiveBoard = (boardId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      activeBoardId: boardId,
    }));
  };

  const getActiveBoard = (): BoardType | null => {
    if (!workspace.activeBoardId) return null;
    
    for (const group of workspace.groups) {
      const board = group.boards.find((b) => b.id === workspace.activeBoardId);
      if (board) return board;
    }
    
    return null;
  };

  const updateBoard = (boardId: string, data: Partial<BoardType>) => {
    setWorkspace((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => ({
        ...g,
        boards: g.boards.map((b) =>
          b.id === boardId ? { ...b, ...data } : b
        ),
      })),
    }));
  };

  const getAllBoards = (): BoardType[] => {
    return workspace.groups.flatMap((g) => g.boards);
  };

  const value: WorkspaceContextType = {
    workspace,
    createGroup,
    deleteGroup,
    renameGroup,
    createBoard,
    deleteBoard,
    renameBoard,
    setActiveBoard,
    getActiveBoard,
    updateBoard,
    getAllBoards,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
