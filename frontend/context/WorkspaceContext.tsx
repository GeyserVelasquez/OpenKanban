"use client";
import api from "@/lib/axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  BoardType,
  GroupType,
  WorkspaceData,
  ColumnType,
  HistoryLogType,
  CardType,
} from "@/types/kanban";

const CURRENT_USER = "Manuel Casique";

const createHistoryLog = (message: string): HistoryLogType => ({
  timestamp: Date.now(),
  userId: CURRENT_USER,
  message,
});

const createDefaultColumns = async (
  boardId: string
): Promise<ColumnType[]> => {
  const defaultColsData = [
    { title: "Pendiente", color: "bg-slate-200 dark:bg-gray-700" },
    { title: "En Proceso", color: "bg-blue-200 dark:bg-blue-900/40" },
    { title: "Hecho", color: "bg-green-200 dark:bg-green-900/40" },
  ];

  const createdColumns: ColumnType[] = [];

  try {
    await api.get("http://localhost:8000/sanctum/csrf-cookie");

    for (const colData of defaultColsData) {
      const response = await api.post("http://localhost:8000/api/columns", {
        title: colData.title,
        color: colData.color,
        board_id: boardId,
      });

      createdColumns.push({
        id: response.data.id.toString(),
        title: response.data.title || response.data.name || colData.title,
        color: response.data.color || colData.color,
        cards: [],
      });
    }
  } catch (error) {
    console.error("Error creando columnas por defecto:", error);
  }

  return createdColumns;
};

interface WorkspaceContextType {
  workspace: WorkspaceData;
  createGroup: (title: string, description?: string) => Promise<void>;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, newTitle: string) => void;
  createBoard: (groupId: string, title: string) => Promise<string>;
  deleteBoard: (boardId: string) => Promise<void>;
  renameBoard: (boardId: string, newTitle: string) => Promise<void>;
  setActiveBoard: (boardId: string) => Promise<void>;
  getActiveBoard: () => BoardType | null;
  updateBoard: (boardId: string, data: Partial<BoardType>) => Promise<void>;
  updateColumn: (columnId: string, data: { name?: string; color?: string }) => Promise<void>;
  updateColumnPosition: (columnId: string, newPosition: number) => Promise<void>;
  createColumn: (boardId: string, name: string, color: string, position: number) => Promise<ColumnType | null>;
  deleteColumn: (columnId: string) => Promise<boolean>;
  createTask: (columnId: string, title: string, description: string, priority: "low" | "medium" | "high") => Promise<CardType | null>;
  updateTask: (taskId: string, data: Partial<CardType>) => Promise<void>;
  getAllBoards: () => BoardType[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

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
  const [workspace, setWorkspace] = useState<WorkspaceData>({
    groups: [],
    activeGroupId: null,
    activeBoardId: null,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadWorkspaceFromApi = async () => {
      try {
        try {
          await api.get("http://localhost:8000/sanctum/csrf-cookie");
        } catch { }

        const res = await api.get("http://localhost:8000/api/groups");
        if (!mounted) return;

        const apiGroups = Array.isArray(res.data) ? res.data : [];

        const mappedGroups: GroupType[] = apiGroups.map((g: any) => {
          const folders = Array.isArray(g.folders) ? g.folders : [];
          const boardsFromFolders = folders.flatMap((f: any) =>
            Array.isArray(f.boards) ? f.boards : []
          );

          const boards: BoardType[] = boardsFromFolders.map((b: any) => ({
            id: String(b.id),
            name: b.name ?? b.title ?? "Untitled",
            backgroundColor: b.color ?? "bg-gray-100 dark:bg-gray-800",
            columns: [],
            activityLog: [],
            groupId: String(g.id),
            createdAt: Date.now(),
          }));

          return {
            id: String(g.id),
            title: g.name ?? g.title ?? "Grupo",
            type: "group",
            boards,
            createdAt: Date.now(),
          } as GroupType;
        });

        setWorkspace({
          groups: mappedGroups,
          activeGroupId: mappedGroups[0]?.id ?? null,
          activeBoardId: mappedGroups[0]?.boards?.[0]?.id ?? null,
        });

        setMounted(true);
      } catch (err) {
        console.error("Error cargando workspace desde API:", err);
        setMounted(true);
      }
    };

    loadWorkspaceFromApi();
    return () => {
      mounted = false;
    };
  }, []);

  const createGroup = async (
    title: string,
    description: string = ""
  ): Promise<void> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await api.post<GroupType>(
        "http://localhost:8000/api/groups",
        {
          name: title,
          description: description,
        }
      );
      const createdApiGroup = response.data;
      const newGroup: GroupType = {
        id: createdApiGroup.id.toString(),
        title: createdApiGroup.title,
        type: "group",
        boards: [],
        createdAt: Date.now(),
      };

      setWorkspace((prev) => ({
        ...prev,
        groups: [...prev.groups, newGroup],
        activeGroupId:
          prev.groups.length === 0 ? newGroup.id : prev.activeGroupId,
      }));
    } catch (error) {
      console.error("Fallo al crear el grupo:", error);
      alert("Error al crear el grupo. Verifica el backend y la conexión.");
    }
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const apiUrl = `http://localhost:8000/api/groups/${groupId}`;
      await api.delete(apiUrl);
      setWorkspace((prev) => {
        const groupToDelete = prev.groups.find((g) => g.id === groupId);
        const newGroups = prev.groups.filter((g) => g.id !== groupId);
        const wasActive = prev.activeGroupId === groupId;
        const activeBoardInDeletedGroup = groupToDelete?.boards.some(
          (b) => b.id === prev.activeBoardId
        );

        return {
          ...prev,
          groups: newGroups,
          activeGroupId:
            wasActive && newGroups.length > 0 ? newGroups[0].id : null,
          activeBoardId: activeBoardInDeletedGroup ? null : prev.activeBoardId,
        };
      });
    } catch (error) {
      console.error("Fallo al eliminar el grupo en la API:", error);
      alert("Error al eliminar el grupo. Por favor, inténtalo de nuevo.");
    }
  };

  const renameGroup = async (
    groupId: string,
    newTitle: string
  ): Promise<void> => {
    if (!newTitle.trim()) return;

    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      const apiUrl = `http://localhost:8000/api/groups/${groupId}`;
      await api.put(apiUrl, {
        name: newTitle.trim(),
      });

      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === groupId ? { ...g, title: newTitle.trim() } : g
        ),
      }));
    } catch (error) {
      console.error(`Fallo al renombrar el grupo ${groupId}:`, error);
      alert("Error al renombrar el grupo. Verifica la conexión.");
    }
  };

  const createBoard = async (
    groupId: string,
    title: string
  ): Promise<string> => {
    if (!title.trim()) return "";

    try {
      // 1. Obtener CSRF y preparar payload
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      // El ID del grupo debe ir al backend como group_id
      const boardPayload = {
        name: title.trim(),
        group_id: groupId,
      };

      // 2. Llamada a la API (POST /api/boards)
      // Backend crea el board Y las 3 columnas por defecto automáticamente
      const response = await api.post<any>(
        "http://localhost:8000/api/boards",
        boardPayload
      );
      const createdApiBoard = response.data;
      const newBoardId = createdApiBoard.id.toString();

      // 3. Mapear columnas del backend al formato frontend
      const backendColumns = Array.isArray(createdApiBoard.columns)
        ? createdApiBoard.columns
        : [];

      const mappedColumns: ColumnType[] = backendColumns.map((col: any) => ({
        id: col.id.toString(),
        title: col.name || col.title || "Sin título",
        color: col.color || "bg-slate-200 dark:bg-gray-700",
        cards: Array.isArray(col.tasks) ? col.tasks : [],
      }));

      const activityLog = [createHistoryLog("Tablero creado")];

      const newBoard: BoardType = {
        id: newBoardId,
        name: createdApiBoard.name,
        backgroundColor: createdApiBoard.color || "bg-gray-100 dark:bg-gray-800",
        columns: mappedColumns,
        activityLog: activityLog,
        groupId: groupId,
        createdAt: Date.now(),
        members: [],
      };

      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === groupId ? { ...g, boards: [...g.boards, newBoard] } : g
        ),
        activeBoardId: prev.activeBoardId || newBoard.id,
      }));

      return newBoard.id;
    } catch (error) {
      console.error("Fallo al crear el tablero:", error);
      alert("Error al crear el tablero. Verifica la conexión.");
      return "";
    }
  };

  const deleteBoard = async (boardId: string): Promise<void> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      const apiUrl = `http://localhost:8000/api/boards/${boardId}`;

      await api.delete(apiUrl);

      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g: GroupType) => ({
          ...g,
          boards: g.boards.filter((b: BoardType) => b.id !== boardId),
        })),
        activeBoardId:
          prev.activeBoardId === boardId ? null : prev.activeBoardId,
      }));
    } catch (error) {
      console.error(`Fallo al eliminar el tablero ${boardId}:`, error);
      alert("Error al eliminar el tablero. Por favor, verifica la conexión.");
    }
  };

  const renameBoard = async (boardId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      await api.put(`http://localhost:8000/api/boards/${boardId}`, {
        name: newTitle.trim(),
      });

      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) => ({
          ...g,
          boards: g.boards.map((b) =>
            b.id === boardId ? { ...b, name: newTitle.trim() } : b
          ),
        })),
      }));
    } catch (error) {
      console.error(`Error renaming board ${boardId}:`, error);
      alert("Error al renombrar el tablero. Verifica la conexión.");
    }
  };

  const setActiveBoard = async (boardId: string) => {
    try {
      // 1. Llamada a la API para obtener el tablero completo
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await api.get<any>(
        `http://localhost:8000/api/boards/${boardId}`
      );
      const fullBoardData = response.data;

      // 2. Normalización de datos: mapear estructura backend a frontend
      const backendColumns = Array.isArray(fullBoardData.columns)
        ? fullBoardData.columns
        : [];

      const safeBoardData = {
        ...fullBoardData,
        backgroundColor: fullBoardData.color || fullBoardData.backgroundColor || "bg-gray-100 dark:bg-gray-800",
        columns: backendColumns
          .map((col: any) => ({
            id: col.id.toString(),
            title: col.name || col.title || "",
            color: col.color || "bg-slate-200 dark:bg-gray-700",
            cards: Array.isArray(col.tasks)
              ? col.tasks.map((task: any) => ({
                ...task,
                id: task.id.toString(),
                columnId: col.id.toString(),
              }))
              : [],
          }))
          .filter((col: any) => col.title.trim() !== ""),
      };

      // 3. Actualizar el estado del workspace con los datos frescos y seguros
      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) => ({
          ...g,
          boards: g.boards.map((b) =>
            b.id === boardId ? { ...b, ...safeBoardData } : b
          ),
        })),
        activeBoardId: boardId,
      }));
    } catch (error) {
      console.error(`Error cargando el tablero ${boardId}:`, error);
    }
  };

  const getActiveBoard = (): BoardType | null => {
    if (!workspace.activeBoardId) return null;

    for (const group of workspace.groups) {
      const board = group.boards.find((b) => b.id === workspace.activeBoardId);
      if (board) return board;
    }

    return null;
  };

  const updateBoard = async (boardId: string, data: Partial<BoardType>) => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      // Only send fields the backend accepts (name and color)
      const backendData: any = {};
      if (data.name !== undefined) {
        backendData.name = data.name;
      }
      if (data.backgroundColor !== undefined) {
        backendData.color = data.backgroundColor;
      }

      if (Object.keys(backendData).length > 0) {
        const numericId = parseInt(boardId, 10);
        await api.put(`http://localhost:8000/api/boards/${numericId}`, backendData);
      }

      // Update local state with all provided data
      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) => ({
          ...g,
          boards: g.boards.map((b) =>
            b.id === boardId ? { ...b, ...data } : b
          ),
        })),
      }));
    } catch (error) {
      console.error(`Error actualizando el tablero ${boardId}:`, error);
      alert("Error al guardar los cambios. Verifica tu conexión.");
    }
  };

  const updateColumn = async (columnId: string, data: { name?: string; color?: string }) => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      const numericId = parseInt(columnId, 10);
      await api.put(`http://localhost:8000/api/columns/${numericId}`, data);

      // Update local state
      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) => ({
          ...g,
          boards: g.boards.map((b) => ({
            ...b,
            columns: b.columns.map((col) =>
              col.id === columnId
                ? {
                  ...col,
                  ...(data.name && { title: data.name }),
                  ...(data.color && { color: data.color }),
                }
                : col
            ),
          })),
        })),
      }));
    } catch (error) {
      console.error(`Error updating column ${columnId}:`, error);
      alert("Error al actualizar la columna. Verifica tu conexión.");
    }
  };

  const updateColumnPosition = async (columnId: string, newPosition: number) => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const numericId = parseInt(columnId, 10);
      await api.put(`http://localhost:8000/api/columns/${numericId}`, {
        position: newPosition,
      });
    } catch (error) {
      console.error(`Error updating column position ${columnId}:`, error);
    }
  };

  const createColumn = async (
    boardId: string,
    name: string,
    color: string,
    position: number
  ): Promise<ColumnType | null> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await api.post("http://localhost:8000/api/columns", {
        name,
        color,
        board_id: parseInt(boardId, 10),
        position,
      });

      return {
        id: response.data.id.toString(),
        title: response.data.name || name,
        color: response.data.color || color,
        cards: [],
      };
    } catch (error) {
      console.error("Error creating column:", error);
      alert("Error al crear la columna. Verifica tu conexión.");
      return null;
    }
  };

  const deleteColumn = async (columnId: string): Promise<boolean> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const numericId = parseInt(columnId, 10);
      await api.delete(`http://localhost:8000/api/columns/${numericId}`);
      return true;
    } catch (error) {
      console.error("Error deleting column:", error);
      alert("Error al eliminar la columna. Verifica tu conexión.");
      return false;
    }
  };

  const createTask = async (
    columnId: string,
    title: string,
    description: string,
    priority: "low" | "medium" | "high"
  ): Promise<CardType | null> => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await api.post("http://localhost:8000/api/tasks", {
        name: title,
        description,
        column_id: parseInt(columnId, 10),
        state_id: 1, // Default state (To Do)
        priority,
        position: 1024.0,
      });

      return {
        id: response.data.id.toString(),
        title: response.data.name || response.data.title, // Handle name/title mismatch
        description: response.data.description || "",
        columnId: columnId,
        priority: response.data.priority || priority,
        history: [],
        tags: [],
        comments: [],
      };
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error al crear la tarea. Verifica tu conexión.");
      return null;
    }
  };

  const updateTask = async (taskId: string, data: Partial<CardType>) => {
    try {
      await api.get("http://localhost:8000/sanctum/csrf-cookie");
      const numericId = parseInt(taskId, 10);

      // Map priority to color for backend persistence
      let color = undefined;
      if (data.priority) {
        switch (data.priority) {
          case "high": color = "#EF4444"; break;
          case "medium": color = "#F97316"; break;
          case "low": color = "#3B82F6"; break;
        }
      }

      await api.put(`http://localhost:8000/api/tasks/${numericId}`, {
        name: data.title,
        description: data.description,
        color: color,
      });
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
    }
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
    updateColumn,
    updateColumnPosition,
    createColumn,
    deleteColumn,
    createTask,
    updateTask,
    getAllBoards,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
