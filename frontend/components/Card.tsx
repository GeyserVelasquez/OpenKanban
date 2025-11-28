"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardType } from "@/types/kanban";

interface CardProps {
  card: CardType;
  onEditCard: (cardId: string, newTitle: string, newDescription: string, newPriority: "low" | "medium" | "high") => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (cardId: string) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

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

const IconMessage = ({ className }: { className?: string }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Card({ card, onEditCard, onDeleteCard, onCardClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditCard(card.id, card.title, card.description, card.priority);
  };

  const handleCardClick = () => {
    onCardClick(card.id);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-100 dark:bg-gray-700 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-gray-600 opacity-50 h-[150px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-200 group touch-none"
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            priorityColors[card.priority]
          }`}
        >
          {priorityLabels[card.priority]}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEditClick}
            className="hover:bg-slate-100 dark:hover:bg-gray-600 p-1.5 rounded-lg transition-all"
            title="Editar tarea"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconEdit className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card.id);
            }}
            className="hover:bg-red-100 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-all"
            title="Eliminar tarea"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <IconTrash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <h4 className="font-semibold text-slate-800 dark:text-white mb-2 leading-snug">
        {card.title}
      </h4>

      {card.description && (
        <p className="text-sm text-slate-500 dark:text-slate-300 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className={`${tag.color} text-white text-xs px-2 py-0.5 rounded font-medium`}
            >
              {tag.name}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 px-2 py-0.5">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden border-2 border-white dark:border-gray-700">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${card.id}`}
              alt="User"
              className="w-full h-full"
            />
          </div>
          {card.comments && card.comments.length > 0 && (
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <IconMessage className="w-3.5 h-3.5" />
              <span className="text-xs">{card.comments.length}</span>
            </div>
          )}
        </div>
        {card.history && card.history.length > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {card.history.length} {card.history.length === 1 ? "cambio" : "cambios"}
          </span>
        )}
      </div>
    </div>
  );
}
