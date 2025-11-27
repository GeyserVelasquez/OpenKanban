"use client";

import React, { useState } from "react";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  groupTitle: string;
}

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

export default function CreateBoardModal({ isOpen, onClose, onCreate, groupTitle }: CreateBoardModalProps) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (title.trim()) {
      onCreate(title.trim());
      setTitle("");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={handleCancel}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Crear Nuevo Tablero</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <IconX className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="mb-4 px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
          <p className="text-sm text-cyan-700 dark:text-cyan-400">
            Se creará en: <span className="font-semibold">{groupTitle}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Nombre del Tablero
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Sprint 1, Proyecto Web, Ideas..."
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              El tablero tendrá las columnas: Pendiente, En Proceso, Hecho
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            Crear Tablero
          </button>
        </div>
      </div>
    </div>
  );
}
