"use client";

import React from "react";
import { CardType } from "@/types/kanban";

interface CardProps {
  card: CardType;
  onEditCard: (cardId: string, newTitle: string, newDescription: string, newPriority: "low" | "medium" | "high") => void;
  onDeleteCard: (cardId: string) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
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

export default function Card({ card, onEditCard, onDeleteCard }: CardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditCard(card.id, card.title, card.description, card.priority);
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 cursor-pointer hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-200 group">
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

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden border-2 border-white dark:border-gray-700">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${card.id}`}
              alt="User"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
