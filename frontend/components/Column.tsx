"use client";

import React, { useState, useMemo } from "react";
import { ColumnType, CardType } from "@/types/kanban";
import Card from "./Card";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onEditCard: (cardId: string, title: string, description: string, priority: "low" | "medium" | "high") => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (cardId: string) => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onChangeColor: (columnId: string, color: string) => void;
}

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

const IconEdit = ({ className }: { className?: string }) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconTrash = ({ className }: { className?: string }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const IconPalette = ({ className }: { className?: string }) => (
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
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const COLUMN_COLORS = [
  { name: "Gris", value: "bg-slate-200 dark:bg-gray-700" },
  { name: "Azul", value: "bg-blue-200 dark:bg-blue-900/40" },
  { name: "Verde", value: "bg-green-200 dark:bg-green-900/40" },
  { name: "Rosa", value: "bg-pink-200 dark:bg-pink-900/40" },
  { name: "Púrpura", value: "bg-purple-200 dark:bg-purple-900/40" },
  { name: "Naranja", value: "bg-orange-200 dark:bg-orange-900/40" },
];

export default function Column({ column, onAddCard, onEditCard, onDeleteCard, onCardClick, onEditColumn, onDeleteColumn, onChangeColor }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const cardIds = useMemo(() => column.cards.map((card) => card.id), [column.cards]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleCancel = () => {
    setNewCardTitle("");
    setIsAddingCard(false);
  };

  const columnColor = column.color || "bg-slate-200 dark:bg-gray-700";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`w-80 flex-shrink-0 h-[500px] ${columnColor} rounded-2xl p-4 opacity-50 border-2 border-dashed border-cyan-400`}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-80 flex-shrink-0 flex flex-col max-h-full ${columnColor} rounded-2xl p-4 transition-colors duration-200`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-2 mb-4 cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="flex items-center gap-2 flex-1">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">{column.title}</h3>
          <button
            onClick={onEditColumn}
            className="hover:bg-slate-200 dark:hover:bg-gray-600 p-1 rounded-lg transition-all"
            title="Editar nombre de la lista"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconEdit className="w-3 h-3 text-slate-500 dark:text-slate-300" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="hover:bg-slate-200 dark:hover:bg-gray-600 p-1.5 rounded-lg transition-all"
              title="Cambiar color"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <IconPalette className="w-4 h-4 text-slate-500 dark:text-slate-300" />
            </button>
            
            {showColorPicker && (
              <div 
                className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-slate-200 dark:border-gray-600 p-3 z-50 min-w-[200px]"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Color de la columna</p>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMN_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        onChangeColor(column.id, color.value);
                        setShowColorPicker(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        columnColor === color.value
                          ? "ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
                          : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <span className="bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full">
            {column.cards.length}
          </span>
          <button
            onClick={onDeleteColumn}
            className="hover:bg-red-100 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-all"
            title="Eliminar columna"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconTrash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-3 min-h-[100px]">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              onEditCard={onEditCard} 
              onDeleteCard={onDeleteCard} 
              onCardClick={onCardClick} 
            />
          ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border-2 border-cyan-400 shadow-md">
          <textarea
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="¿Qué hay que hacer?"
            className="w-full text-sm bg-transparent border-none focus:ring-0 text-slate-700 dark:text-white placeholder-slate-400 resize-none mb-2"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddCard}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              Añadir
            </button>
            <button
              onClick={handleCancel}
              className="hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-gray-600/50 p-2 rounded-xl transition-all w-full group"
        >
          <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-gray-600 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            <IconPlus className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Añadir tarjeta</span>
        </button>
      )}
    </div>
  );
}
