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
  deleteBoard: (boardId: string) => Promise<void>;
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

  // Save to localStorage whenever workspace changes
  // useEffect(() => {
  //   if (!mounted) return;
  //   localStorage.setItem("OPENKANBAN_WORKSPACE", JSON.stringify(workspace));
  // }, [workspace, mounted]);

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

      const defaultColumns = createDefaultColumns();
      const activityLog = [createHistoryLog("Tablero creado")];

      const newBoard: BoardType = {
        id: createdApiBoard.id.toString(),
        name: createdApiBoard.name,
        backgroundColor: "bg-gray-100 dark:bg-gray-800",
        columns: defaultColumns,
        activityLog: activityLog,
        groupId: createdApiBoard.groupId?.toString(),
        createdAt: Date.now(),
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

  const setActiveBoard = async (boardId: string) => {
  try {
    // ... (llamada a API igual que antes)
    const response = await api.get<BoardType>(`http://localhost:8000/api/boards/${boardId}`);
    const fullBoardData = response.data;

    // 2. Normalización de datos:
    const safeBoardData = {
      ...fullBoardData,
      columns: Array.isArray(fullBoardData.columns)
        ? fullBoardData.columns
            .map((col: any) => ({
              ...col,
              title: col.title || col.name || "", // <--- INTENTA RECUPERAR EL NOMBRE REAL
              cards: Array.isArray(col.cards) ? col.cards : [],
            }))
            .filter((col: any) => col.title.trim() !== "") // <--- SI NO TIENE TÍTULO, NO SE MUESTRA
        : [],
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



  // const setActiveBoard = (boardId: string) => {
  //   setWorkspace((prev) => ({
  //     ...prev,
  //     activeBoardId: boardId,
  //   }));
  // };

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
