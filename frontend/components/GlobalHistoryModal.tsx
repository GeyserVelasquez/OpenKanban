import React from "react";
import { HistoryLogType } from "@/types/kanban";
import HistoryFeed from "./HistoryFeed";

interface GlobalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryLogType[];
}

export default function GlobalHistoryModal({ isOpen, onClose, history }: GlobalHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 transition-opacity" onClick={onClose}>
      <div 
        className="h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-500">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Actividad del Tablero
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-gray-900/50">
          <HistoryFeed history={history} />
        </div>
      </div>
    </div>
  );
}
