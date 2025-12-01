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
} from "@/types/kanban";

const CURRENT_USER = "Manuel Casique";

const createHistoryLog = (message: string): HistoryLogType => ({
  timestamp: Date.now(),
  userId: CURRENT_USER,
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
  createGroup: (title: string, description?: string) => Promise<void>;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, newTitle: string) => void;
  createBoard: (groupId: string, title: string) => Promise<string>;
  deleteBoard: (boardId: string) => void;
  renameBoard: (boardId: string, newTitle: string) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoard: () => BoardType | null;
  updateBoard: (boardId: string, data: Partial<BoardType>) => void;
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
            boards: [
              {
                ...parsedOldBoard,
                groupId: `group-${Date.now()}`,
                createdAt: Date.now(),
              },
            ],
            createdAt: Date.now(),
          };

          const newWorkspace: WorkspaceData = {
            groups: [defaultGroup],
            activeGroupId: defaultGroup.id,
            activeBoardId: parsedOldBoard.id,
          };

          setWorkspace(newWorkspace);
          localStorage.setItem(
            "OPENKANBAN_WORKSPACE",
            JSON.stringify(newWorkspace)
          );
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

  // Reemplazar la función createGroup existente en WorkspaceProvider

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

  // Reemplazar la función deleteGroup existente en WorkspaceProvider

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

  // Reemplazar la función renameGroup existente en WorkspaceProvider

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

  // Reemplazar la función createBoard existente en WorkspaceProvider

  const createBoard = async (
    groupId: string,
    title: string
  ): Promise<string> => {
    if (!title.trim()) return ""; // Validación básica

    try {
      // 1. Obtener CSRF y preparar payload
      await api.get("http://localhost:8000/sanctum/csrf-cookie");

      // El ID del grupo debe ir al backend como group_id
      const boardPayload = {
        name: title.trim(),
        group_id: groupId,
      };

      // 2. Llamada a la API (POST /api/boards)
      const response = await api.post<BoardType>(
        "http://localhost:8000/api/boards",
        boardPayload
      );
      const createdApiBoard = response.data;

      // 3. Generar los datos complejos que se manejan en el frontend
      const defaultColumns = createDefaultColumns();
      const activityLog = [createHistoryLog("Tablero creado")];

      // 4. Crear el objeto BoardType combinando API data con defaults locales
      const newBoard: BoardType = {
        id: createdApiBoard.id.toString(), // ID numérico de la API a string
        name: createdApiBoard.name,
        backgroundColor: "bg-gray-100 dark:bg-gray-800",
        columns: defaultColumns, // Datos generados localmente
        activityLog: activityLog, // Datos generados localmente
        groupId: createdApiBoard.groupId?.toString(), // ID del grupo devuelto
        createdAt: Date.now(),
      };

      // 5. Actualizar el estado local
      setWorkspace((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === groupId ? { ...g, boards: [...g.boards, newBoard] } : g
        ),
        activeBoardId: prev.activeBoardId || newBoard.id,
      }));

      // 6. Devolver el ID del tablero creado
      return newBoard.id;
    } catch (error) {
      console.error("Fallo al crear el tablero:", error);
      alert("Error al crear el tablero. Verifica la conexión.");
      return ""; // Devolver vacío si hay un fallo
    }
  };

  // const renameGroup = (groupId: string, newTitle: string) => {
  //   setWorkspace((prev) => ({
  //     ...prev,
  //     groups: prev.groups.map((g) =>
  //       g.id === groupId ? { ...g, title: newTitle } : g
  //     ),
  //   }));
  // };

  // const createBoard = (groupId: string, title: string): string => {
  //   const newBoard: BoardType = {
  //     id: `board-${Date.now()}`,
  //     name: title,
  //     backgroundColor: "bg-gray-100 dark:bg-gray-800",
  //     columns: createDefaultColumns(),
  //     activityLog: [createHistoryLog("Tablero creado")],
  //     groupId,
  //     createdAt: Date.now(),
  //   };

  //   setWorkspace((prev) => ({
  //     ...prev,
  //     groups: prev.groups.map((g) =>
  //       g.id === groupId ? { ...g, boards: [...g.boards, newBoard] } : g
  //     ),
  //     activeBoardId: prev.activeBoardId || newBoard.id,
  //   }));

  //   return newBoard.id;
  // };

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
        boards: g.boards.map((b) => (b.id === boardId ? { ...b, ...data } : b)),
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
