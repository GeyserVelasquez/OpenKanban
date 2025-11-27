"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { useWorkspace } from "@/context/WorkspaceContext";
import Sidebar from "@/components/Sidebar";
import BoardHeader from "@/components/BoardHeader";
import Column from "@/components/Column";
import Card from "@/components/Card";
import DetailDrawer from "@/components/DetailDrawer";
import GlobalHistoryModal from "@/components/GlobalHistoryModal";
import DashboardModal from "@/components/DashboardModal";
import { BoardType, ColumnType, CardType, HistoryLogType } from "@/types/kanban";

const CURRENT_USER = "Usuario AAAZZZ";

const createHistoryLog = (message: string): HistoryLogType => ({
  timestamp: Date.now(),
  userId: CURRENT_USER,
  message, 
});

const IconPlus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

// Empty state component
const EmptyState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center max-w-md px-6">
      <div className="mb-6">
        <svg
          className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">
        No hay tablero activo
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Crea un grupo y un tablero desde el sidebar para comenzar a organizar tus tareas.
      </p>
      <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
        <p>💡 <strong>Tip:</strong> Haz clic en el botón "+" en el sidebar</p>
        <p>📋 Los tableros nuevos vienen con columnas predeterminadas</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { getActiveBoard, updateBoard, workspace } = useWorkspace();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskColumn, setNewTaskColumn] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");

  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDescription, setEditCardDescription] = useState("");
  const [editCardPriority, setEditCardPriority] = useState<"low" | "medium" | "high">("medium");

  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  
  const [dragStartColumnId, setDragStartColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load active board from workspace
  useEffect(() => {
    setMounted(true);
    const activeBoard = getActiveBoard();
    if (activeBoard) {
      setBoard(activeBoard);
    }
  }, [workspace.activeBoardId]);

  // Sync board changes to workspace
  useEffect(() => {
    if (!mounted || !board) return;
    updateBoard(board.id, board);
  }, [board, mounted]);

  const columnIds = useMemo(() => board?.columns.map((col) => col.id) || [], [board?.columns]);

  const handleColorChange = (newColor: string) => {
    if (!board) return;
    setBoard((prev) => prev ? { ...prev, backgroundColor: newColor } : null);
  };

  const handleAddNewCard = (columnId: string, title: string) => {
    if (!board) return;
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      title,
      description: "",
      columnId,
      priority: "medium",
      history: [createHistoryLog("Tarjeta creada")],
      tags: [],
      comments: [],
    };

    setBoard((prev) => prev ? ({
      ...prev,
      activityLog: [createHistoryLog(`Tarjeta "${title}" creada en lista`), ...prev.activityLog],
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ),
    }) : null);
  };

  const handleCreateTask = () => {
    if (!board) return;
    setIsCreatingTask(true);
    if (board.columns.length > 0) {
      setNewTaskColumn(board.columns[0].id);
    }
  };

  const handleSaveTask = () => {
    if (!board) return;
    if (newTaskTitle.trim() && newTaskColumn) {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        title: newTaskTitle.trim(),
        description: "",
        columnId: newTaskColumn,
        priority: newTaskPriority,
        history: [createHistoryLog("Tarjeta creada")],
        tags: [],
        comments: [],
      };

      const columnTitle = board.columns.find(c => c.id === newTaskColumn)?.title || "lista";

      setBoard((prev) => prev ? ({
        ...prev,
        activityLog: [createHistoryLog(`Tarea "${newTaskTitle}" creada en ${columnTitle}`), ...prev.activityLog],
        columns: prev.columns.map((col) =>
          col.id === newTaskColumn
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        ),
      }) : null);

      setNewTaskTitle("");
      setNewTaskPriority("medium");
      setIsCreatingTask(false);
    }
  };

  const handleCancelTask = () => {
    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setIsCreatingTask(false);
  };

  const handleEditCard = (cardId: string, title: string, description: string, priority: "low" | "medium" | "high") => {
    if (!board) return;
    const card = board.columns.flatMap(col => col.cards).find(c => c.id === cardId);
    if (card) {
      setEditingCard(card);
      setEditCardTitle(title);
      setEditCardDescription(description);
      setEditCardPriority(priority);
    }
  };

  const handleSaveCardEdit = () => {
    if (!board || !editingCard || !editCardTitle.trim()) return;
    
    const changes: string[] = [];
    
    if (editCardTitle.trim() !== editingCard.title) changes.push("título");
    if (editCardDescription.trim() !== editingCard.description) changes.push("descripción");
    if (editCardPriority !== editingCard.priority) changes.push("prioridad");

    const updatedCard: CardType = {
      ...editingCard,
      title: editCardTitle.trim(),
      description: editCardDescription.trim(),
      priority: editCardPriority,
      history: changes.length > 0
        ? [...editingCard.history, createHistoryLog(`Actualizó ${changes.join(", ")}`)]
        : editingCard.history,
    };

    setBoard((prev) => prev ? ({
      ...prev,
      activityLog: changes.length > 0 
        ? [createHistoryLog(`Actualizó ${changes.join(", ")} de "${editingCard.title}"`), ...prev.activityLog]
        : prev.activityLog,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === editingCard.id ? updatedCard : card
        ),
      })),
    }) : null);

    setEditingCard(null);
    setEditCardTitle("");
    setEditCardDescription("");
    setEditCardPriority("medium");
  };

  const handleCancelCardEdit = () => {
    setEditingCard(null);
    setEditCardTitle("");
    setEditCardDescription("");
    setEditCardPriority("medium");
  };

  const handleDeleteCard = (cardId: string) => {
    if (!board) return;
    const card = board.columns.flatMap(col => col.cards).find(c => c.id === cardId);
    setBoard((prev) => prev ? ({
      ...prev,
      activityLog: card ? [createHistoryLog(`Eliminó tarjeta "${card.title}"`), ...prev.activityLog] : prev.activityLog,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      })),
    }) : null);
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleUpdateCard = (updatedCard: CardType) => {
    if (!board) return;
    const originalCard = board.columns
      .flatMap(col => col.cards)
      .find(c => c.id === updatedCard.id);

    if (!originalCard) return;

    const changes: string[] = [];
    
    if (updatedCard.title !== originalCard.title) changes.push("título");
    if (updatedCard.description !== originalCard.description) changes.push("descripción");
    if (updatedCard.priority !== originalCard.priority) changes.push("prioridad");

    const cardWithHistory: CardType = changes.length > 0
      ? {
          ...updatedCard,
          history: [...updatedCard.history, createHistoryLog(`Actualizó ${changes.join(", ")}`)],
        }
      : updatedCard;

    setBoard((prev) => prev ? ({
      ...prev,
      activityLog: changes.length > 0 
        ? [createHistoryLog(`Actualizó ${changes.join(", ")} de "${updatedCard.title}"`), ...prev.activityLog]
        : prev.activityLog,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === updatedCard.id ? cardWithHistory : card
        ),
      })),
    }) : null);
  };

  const handleAddNewColumn = (title: string, insertIndex?: number) => {
    if (!board) return;
    const newColumn: ColumnType = {
      id: `col-${Date.now()}`,
      title,
      color: "bg-slate-200 dark:bg-gray-700",
      cards: [],
    };

    if (insertIndex !== undefined) {
      setBoard((prev) => {
        if (!prev) return null;
        const newColumns = [...prev.columns];
        newColumns.splice(insertIndex, 0, newColumn);
        return { 
          ...prev, 
          activityLog: [createHistoryLog(`Añadió lista "${title}"`), ...prev.activityLog],
          columns: newColumns 
        };
      });
    } else {
      setBoard((prev) => prev ? ({
        ...prev,
        activityLog: [createHistoryLog(`Añadió lista "${title}"`), ...prev.activityLog],
        columns: [...prev.columns, newColumn],
      }) : null);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;
    const col = board.columns.find(c => c.id === columnId);
    setBoard((prev) => prev ? ({
      ...prev,
      activityLog: col ? [createHistoryLog(`Eliminó lista "${col.title}"`), ...prev.activityLog] : prev.activityLog,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }) : null);
  };

  const handleEditColumn = (columnId: string, currentTitle: string) => {
    setEditingColumnId(columnId);
    setEditingColumnTitle(currentTitle);
  };

  const handleSaveColumnTitle = (columnId: string) => {
    if (!board) return;
    if (editingColumnTitle.trim()) {
      setBoard((prev) => prev ? ({
        ...prev,
        activityLog: [createHistoryLog(`Renombró lista a "${editingColumnTitle}"`), ...prev.activityLog],
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, title: editingColumnTitle.trim() }
            : col
        ),
      }) : null);
    }
    setEditingColumnId(null);
    setEditingColumnTitle("");
  };

  const handleCancelEditColumn = () => {
    setEditingColumnId(null);
    setEditingColumnTitle("");
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      handleAddNewColumn(newColumnTitle.trim());
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleCancelColumn = () => {
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const handleChangeColumnColor = (columnId: string, color: string) => {
    if (!board) return;
    setBoard((prev) => prev ? ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, color } : col
      ),
    }) : null);
  };

  // --- Drag and Drop Logic ---

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      setDragStartColumnId(event.active.data.current.card.columnId);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    if (!board) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    // Moving a card over another card
    if (isActiveACard && isOverACard) {
      setBoard((board) => {
        if (!board) return null;
        const activeColumnIndex = board.columns.findIndex((col) =>
          col.cards.some((card) => card.id === activeId)
        );
        const overColumnIndex = board.columns.findIndex((col) =>
          col.cards.some((card) => card.id === overId)
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1) return board;

        const activeColumn = board.columns[activeColumnIndex];
        const overColumn = board.columns[overColumnIndex];

        const activeCardIndex = activeColumn.cards.findIndex((card) => card.id === activeId);
        const overCardIndex = overColumn.cards.findIndex((card) => card.id === overId);

        if (activeColumnIndex === overColumnIndex) {
          return board;
        }

        // Different column
        const newColumns = [...board.columns];
        const activeCard = newColumns[activeColumnIndex].cards[activeCardIndex];
        
        newColumns[activeColumnIndex].cards = [
          ...newColumns[activeColumnIndex].cards.filter((card) => card.id !== activeId),
        ];

        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        const newIndex = overCardIndex >= 0 ? overCardIndex + modifier : newColumns[overColumnIndex].cards.length + 1;

        newColumns[overColumnIndex].cards = [
          ...newColumns[overColumnIndex].cards.slice(0, newIndex),
          { ...activeCard, columnId: newColumns[overColumnIndex].id },
          ...newColumns[overColumnIndex].cards.slice(newIndex, newColumns[overColumnIndex].cards.length),
        ];

        return { ...board, columns: newColumns };
      });
    }

    // Moving a card over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveACard && isOverAColumn) {
      setBoard((board) => {
        if (!board) return null;
        const activeColumnIndex = board.columns.findIndex((col) =>
          col.cards.some((card) => card.id === activeId)
        );
        const overColumnIndex = board.columns.findIndex((col) => col.id === overId);

        if (activeColumnIndex === -1 || overColumnIndex === -1) return board;
        if (activeColumnIndex === overColumnIndex) return board;

        const newColumns = [...board.columns];
        const activeCard = newColumns[activeColumnIndex].cards.find((card) => card.id === activeId);
        if (!activeCard) return board;

        newColumns[activeColumnIndex].cards = newColumns[activeColumnIndex].cards.filter(
          (card) => card.id !== activeId
        );

        newColumns[overColumnIndex].cards = [
          ...newColumns[overColumnIndex].cards,
          { ...activeCard, columnId: newColumns[overColumnIndex].id },
        ];

        return { ...board, columns: newColumns };
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (!board) return;
    setActiveColumn(null);
    setActiveCard(null);

    const { active, over } = event;
    if (!over) {
      setDragStartColumnId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      if (activeId !== overId) {
        setBoard((board) => {
          if (!board) return null;
          const activeColumnIndex = board.columns.findIndex((col) => col.id === activeId);
          const overColumnIndex = board.columns.findIndex((col) => col.id === overId);

          const newColumns = arrayMove(board.columns, activeColumnIndex, overColumnIndex);
          return { ...board, columns: newColumns };
        });
      }
      setDragStartColumnId(null);
      return;
    }

    const isActiveACard = active.data.current?.type === "Card";
    if (isActiveACard) {
      const activeColumnIndex = board.columns.findIndex((col) =>
        col.cards.some((card) => card.id === activeId)
      );
      
      const overColumnIndex = board.columns.findIndex((col) => 
        col.id === overId || col.cards.some((card) => card.id === overId)
      );

      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        const activeColumn = board.columns[activeColumnIndex];
        const overColumn = board.columns[overColumnIndex];
        
        // Check for column change using the stored start column ID
        const hasChangedColumn = dragStartColumnId && dragStartColumnId !== activeColumn.id;

        // Calculate new cards order
        const activeCardIndex = activeColumn.cards.findIndex((card) => card.id === activeId);
        const overCardIndex = overColumn.cards.findIndex((card) => card.id === overId);
        
        let newCards = activeColumn.cards;
        if (activeColumnIndex === overColumnIndex && activeId !== overId) {
           newCards = arrayMove(activeColumn.cards, activeCardIndex, overCardIndex);
        }

        setBoard((prev) => {
          if (!prev) return null;
          const newColumns = [...prev.columns];
          let newActivityLog = prev.activityLog;

          // Apply reordering/updates to the column
          // We need to update the card in the column if we are adding history, 
          // OR if we reordered it.
          
          if (hasChangedColumn) {
             const originalColumnTitle = prev.columns.find(c => c.id === dragStartColumnId)?.title || "otra lista";
             const newColumnTitle = activeColumn.title;
             
             const logMessage = `Movido de **${originalColumnTitle}** a **${newColumnTitle}**`;
             const log = createHistoryLog(logMessage);
             const globalLog = createHistoryLog(`Movió de **${originalColumnTitle}**: "${activeColumn.cards[activeCardIndex].title}" a **${newColumnTitle}**`);
             
             newActivityLog = [globalLog, ...newActivityLog];
             
             // Update card history
             const updatedCard = {
               ...activeColumn.cards[activeCardIndex],
               history: [log, ...activeColumn.cards[activeCardIndex].history]
             };
             
             // If we also reordered (arrayMove), we need to place this updated card in the correct spot
             // But arrayMove works on indices. 
             // If activeId !== overId, we reordered.
             // If activeId === overId, we didn't reorder (just dropped in place in new column).
             
             if (activeColumnIndex === overColumnIndex && activeId !== overId) {
                // We reordered AND changed column (effectively, since onDragOver moved it)
                // newCards already has the reordered list.
                // We need to find the card in newCards and update it.
                const reorderedCardIndex = newCards.findIndex(c => c.id === activeId);
                newCards[reorderedCardIndex] = updatedCard;
             } else {
                // Just changed column, no reorder within the new column (or dropped at end)
                // newCards is just activeColumn.cards.
                // We update the card at activeCardIndex.
                newCards = [...newCards];
                newCards[activeCardIndex] = updatedCard;
             }
          } else if (activeColumnIndex === overColumnIndex && activeId !== overId) {
             // Just reordered in same column (no column change)
             // newCards is already calculated above
          } else {
             // No change (dropped in same place in same column)
             setDragStartColumnId(null);
             return prev;
          }

          newColumns[activeColumnIndex] = { ...activeColumn, cards: newCards };
          
          return {
            ...prev,
            activityLog: newActivityLog,
            columns: newColumns
          };
        });
      }
    }
    setDragStartColumnId(null);
  };

  const selectedCard = selectedCardId && board
    ? board.columns.flatMap(col => col.cards).find(c => c.id === selectedCardId)
    : null;

  // Filtering logic - Enhanced to search by multiple criteria
  const filteredBoard = useMemo(() => {
    if (!board) return null;
    if (!searchTerm.trim()) {
      return board;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return {
      ...board,
      columns: board.columns.map(column => ({
        ...column,
        cards: column.cards.filter(card => {
          // Search in card title
          const titleMatch = card.title.toLowerCase().includes(lowerSearchTerm);
          
          // Search in card description
          const descriptionMatch = card.description?.toLowerCase().includes(lowerSearchTerm);
          
          // Search in tags
          const tagMatch = card.tags?.some(tag => 
            tag.name.toLowerCase().includes(lowerSearchTerm)
          );
          
          // Search in column name
          const columnMatch = column.title.toLowerCase().includes(lowerSearchTerm);
          
          // Search in priority (low, medium, high / baja, media, alta)
          const priorityMap: Record<string, string[]> = {
            'low': ['low', 'baja', 'bajo'],
            'medium': ['medium', 'media', 'medio'],
            'high': ['high', 'alta', 'alto', 'urgente', 'crítico', 'critico']
          };
          
          const priorityMatch = priorityMap[card.priority]?.some(term => 
            term.includes(lowerSearchTerm) || lowerSearchTerm.includes(term)
          );
          
          return titleMatch || descriptionMatch || tagMatch || columnMatch || priorityMatch;
        }),
      })),
    };
  }, [board, searchTerm]);

  // Statistics calculations
  const statistics = useMemo(() => {
    if (!board) {
      return {
        chartData: { labels: [], datasets: [] },
        completed: 0,
        total: 0,
      };
    }

    const columnStats = board.columns.map(col => ({
      label: col.title,
      count: col.cards.length,
    }));

    const totalTasks = board.columns.reduce((sum, col) => sum + col.cards.length, 0);
    const completedColumn = board.columns.find(col => 
      col.title.toLowerCase().includes("hecho") || 
      col.title.toLowerCase().includes("completado") ||
      col.title.toLowerCase().includes("done")
    );
    const completedTasks = completedColumn ? completedColumn.cards.length : 0;

    const chartData = {
      labels: columnStats.map(s => s.label),
      datasets: [
        {
          label: "Tareas por Estado",
          data: columnStats.map(s => s.count),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(251, 146, 60, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(168, 85, 247, 1)",
            "rgba(236, 72, 153, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };

    return {
      chartData,
      completed: completedTasks,
      total: totalTasks,
    };
  }, [board]);

  // Show empty state if no board is active
  if (!board) {
    return (
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full min-w-0">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full min-w-0">
          <BoardHeader 
            boardName={board.name}
            boardColor={board.backgroundColor}
            onColorChange={handleColorChange}
            onCreateTask={handleCreateTask}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onSearchChange={setSearchTerm}
            onOpenDashboard={() => setIsDashboardOpen(true)}
          />

          <main className={`flex-1 overflow-x-auto overflow-y-hidden ${board.backgroundColor} p-6 transition-colors duration-200`}>
            <div className="h-full inline-flex items-start gap-4 group">
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                {(filteredBoard || board).columns.map((column, index) => (
                  <React.Fragment key={column.id}>
                    {editingColumnId === column.id ? (
                      <div className="w-80 flex-shrink-0 bg-slate-50 dark:bg-gray-700 rounded-2xl p-4">
                        <input
                          autoFocus
                          type="text"
                          value={editingColumnTitle}
                          onChange={(e) => setEditingColumnTitle(e.target.value)}
                          className="w-full px-3 py-2 text-lg font-bold border-2 border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-gray-600 dark:text-white mb-3"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveColumnTitle(column.id);
                            }
                            if (e.key === "Escape") {
                              handleCancelEditColumn();
                            }
                          }}
                          onBlur={() => handleSaveColumnTitle(column.id)}
                        />
                      </div>
                    ) : (
                      <Column
                        column={column}
                        onAddCard={handleAddNewCard}
                        onEditCard={handleEditCard}
                        onDeleteCard={handleDeleteCard}
                        onCardClick={handleCardClick}
                        onEditColumn={() => handleEditColumn(column.id, column.title)}
                        onDeleteColumn={() => handleDeleteColumn(column.id)}
                        onChangeColor={handleChangeColumnColor}
                      />
                    )}
                    
                    <button
                      onClick={() => handleAddNewColumn("Nueva Lista", index + 1)}
                      className="w-12 flex-shrink-0 h-12 self-start mt-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-2xl flex items-center justify-center text-slate-400 dark:text-gray-500 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                      title="Añadir lista aquí"
                    >
                      <IconPlus className="w-5 h-5" />
                    </button>
                  </React.Fragment>
                ))}
              </SortableContext>

              {board.columns.length === 0 && (
                isAddingColumn ? (
                  <div className="w-80 flex-shrink-0 bg-slate-50 dark:bg-gray-700 rounded-2xl p-4 border-2 border-cyan-300">
                    <input
                      autoFocus
                      type="text"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="Título de la lista..."
                      className="w-full px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-gray-600 dark:text-white mb-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddColumn();
                        }
                        if (e.key === "Escape") {
                          handleCancelColumn();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddColumn}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                      >
                        Añadir Lista
                      </button>
                      <button
                        onClick={handleCancelColumn}
                        className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 rounded-xl transition-colors"
                      >
                        <IconX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingColumn(true)}
                    className="w-80 flex-shrink-0 h-12 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-2xl flex items-center justify-center text-slate-500 dark:text-gray-400 font-semibold hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all cursor-pointer group"
                  >
                    <IconPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Añadir Lista
                  </button>
                )
              )}
            </div>
          </main>
        </div>

        {mounted && createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeColumn && (
              <Column
                column={activeColumn}
                onAddCard={() => {}}
                onEditCard={() => {}}
                onDeleteCard={() => {}}
                onCardClick={() => {}}
                onEditColumn={() => {}}
                onDeleteColumn={() => {}}
                onChangeColor={() => {}}
              />
            )}
            {activeCard && (
              <Card
                card={activeCard}
                onEditCard={() => {}}
                onDeleteCard={() => {}}
                onCardClick={() => {}}
              />
            )}
          </DragOverlay>,
          document.body
        )}

        {/* Modals */}
        {isCreatingTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancelTask}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Crear Nueva Tarea</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Título de la tarea</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Escribe el título..."
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveTask();
                      }
                      if (e.key === "Escape") {
                        handleCancelTask();
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Columna</label>
                  <select
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
                  >
                    {board.columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Prioridad</label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setNewTaskPriority(priority)}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          newTaskPriority === priority
                            ? priority === "low"
                              ? "bg-blue-500 text-white"
                              : priority === "medium"
                              ? "bg-orange-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {priority === "low" ? "Baja" : priority === "medium" ? "Media" : "Alta"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelTask}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTask}
                  className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Crear Tarea
                </button>
              </div>
            </div>
          </div>
        )}

        {editingCard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancelCardEdit}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Editar Tarea</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Título de la tarea</label>
                  <input
                    autoFocus
                    type="text"
                    value={editCardTitle}
                    onChange={(e) => setEditCardTitle(e.target.value)}
                    placeholder="Escribe el título..."
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleSaveCardEdit();
                      }
                      if (e.key === "Escape") {
                        handleCancelCardEdit();
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Descripción</label>
                  <textarea
                    value={editCardDescription}
                    onChange={(e) => setEditCardDescription(e.target.value)}
                    placeholder="Añade una descripción..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Prioridad</label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setEditCardPriority(priority)}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          editCardPriority === priority
                            ? priority === "low"
                              ? "bg-blue-500 text-white"
                              : priority === "medium"
                              ? "bg-orange-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {priority === "low" ? "Baja" : priority === "medium" ? "Media" : "Alta"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelCardEdit}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCardEdit}
                  className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedCard && (
          <DetailDrawer
            card={selectedCard}
            onClose={() => setSelectedCardId(null)}
            onUpdate={handleUpdateCard}
            onDelete={handleDeleteCard}
          />
        )}

        <GlobalHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={board.activityLog || []}
        />

        <DashboardModal
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          chartData={statistics.chartData}
          completed={statistics.completed}
          total={statistics.total}
        />
      </div>
    </DndContext>
  );
}
