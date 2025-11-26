"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import BoardHeader from "@/components/BoardHeader";
import Column from "@/components/Column";
import { BoardType, ColumnType, CardType } from "@/types/kanban";

const initialBoard: BoardType = {
  id: "board-1",
  name: "OpenKanban Master Project",
  backgroundColor: "bg-gray-50 dark:bg-gray-800",
  columns: [
    {
      id: "col-1",
      title: "Pendiente",
      cards: [
        {
          id: "card-1",
          title: "Diseñar nueva landing page",
          description: "Crear mockups y prototipos para la nueva página de inicio",
          columnId: "col-1",
          priority: "high",
        },
        {
          id: "card-2",
          title: "Investigar competidores",
          description: "Análisis de mercado y benchmarking",
          columnId: "col-1",
          priority: "medium",
        },
        {
          id: "card-3",
          title: "Actualizar documentación",
          description: "",
          columnId: "col-1",
          priority: "low",
        },
      ],
    },
    {
      id: "col-2",
      title: "En Proceso",
      cards: [
        {
          id: "card-4",
          title: "Implementar autenticación",
          description: "Configurar OAuth y JWT para el sistema de login",
          columnId: "col-2",
          priority: "high",
        },
        {
          id: "card-5",
          title: "Optimizar base de datos",
          description: "Mejorar queries y añadir índices",
          columnId: "col-2",
          priority: "medium",
        },
      ],
    },
    {
      id: "col-3",
      title: "Hecho",
      cards: [
        {
          id: "card-6",
          title: "Setup del proyecto Next.js",
          description: "Configuración inicial con TypeScript y Tailwind",
          columnId: "col-3",
          priority: "high",
        },
        {
          id: "card-7",
          title: "Crear componentes base",
          description: "Sidebar, Header y estructura principal",
          columnId: "col-3",
          priority: "medium",
        },
      ],
    },
  ],
};

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

export default function Home() {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [mounted, setMounted] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskColumn, setNewTaskColumn] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDescription, setEditCardDescription] = useState("");
  const [editCardPriority, setEditCardPriority] = useState<"low" | "medium" | "high">("medium");

  // Load board from localStorage
  useEffect(() => {
    setMounted(true);
    const savedBoard = localStorage.getItem("OPENKANBAN_BOARD");
    if (savedBoard) {
      try {
        const parsedBoard = JSON.parse(savedBoard);
        setBoard(parsedBoard);
      } catch (error) {
        console.error("Error loading board from localStorage:", error);
      }
    }
  }, []);

  // Save board to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("OPENKANBAN_BOARD", JSON.stringify(board));
  }, [board, mounted]);

  const handleColorChange = (newColor: string) => {
    setBoard((prev) => ({ ...prev, backgroundColor: newColor }));
  };

  const handleAddNewCard = (columnId: string, title: string) => {
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      title,
      description: "",
      columnId,
      priority: "medium",
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ),
    }));
  };

  const handleCreateTask = () => {
    setIsCreatingTask(true);
    if (board.columns.length > 0) {
      setNewTaskColumn(board.columns[0].id);
    }
  };

  const handleSaveTask = () => {
    if (newTaskTitle.trim() && newTaskColumn) {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        title: newTaskTitle.trim(),
        description: "",
        columnId: newTaskColumn,
        priority: newTaskPriority,
      };

      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === newTaskColumn
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        ),
      }));

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
    const card = board.columns.flatMap(col => col.cards).find(c => c.id === cardId);
    if (card) {
      setEditingCard(card);
      setEditCardTitle(title);
      setEditCardDescription(description);
      setEditCardPriority(priority);
    }
  };

  const handleSaveCardEdit = () => {
    if (editingCard && editCardTitle.trim()) {
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === editingCard.id
              ? { ...card, title: editCardTitle.trim(), description: editCardDescription.trim(), priority: editCardPriority }
              : card
          ),
        })),
      }));
      setEditingCard(null);
      setEditCardTitle("");
      setEditCardDescription("");
      setEditCardPriority("medium");
    }
  };

  const handleCancelCardEdit = () => {
    setEditingCard(null);
    setEditCardTitle("");
    setEditCardDescription("");
    setEditCardPriority("medium");
  };

  const handleDeleteCard = (cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      })),
    }));
  };

  const handleAddNewColumn = (title: string, insertIndex?: number) => {
    const newColumn: ColumnType = {
      id: `col-${Date.now()}`,
      title,
      cards: [],
    };

    if (insertIndex !== undefined) {
      setBoard((prev) => {
        const newColumns = [...prev.columns];
        newColumns.splice(insertIndex, 0, newColumn);
        return { ...prev, columns: newColumns };
      });
    } else {
      setBoard((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }));
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }));
  };

  const handleEditColumn = (columnId: string, currentTitle: string) => {
    setEditingColumnId(columnId);
    setEditingColumnTitle(currentTitle);
  };

  const handleSaveColumnTitle = (columnId: string) => {
    if (editingColumnTitle.trim()) {
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, title: editingColumnTitle.trim() }
            : col
        ),
      }));
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

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <BoardHeader 
          boardName={board.name}
          boardColor={board.backgroundColor}
          onColorChange={handleColorChange}
          onCreateTask={handleCreateTask}
        />

        <main className={`flex-1 overflow-x-auto overflow-y-hidden ${board.backgroundColor} p-6 transition-colors duration-200`}>
          <div className="h-full inline-flex items-start gap-4 group">
            {board.columns.map((column, index) => (
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
                    onEditColumn={() => handleEditColumn(column.id, column.title)}
                    onDeleteColumn={() => handleDeleteColumn(column.id)}
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

      {/* Create Task Modal */}
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

      {/* Edit Card Modal */}
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
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
