"use client";

import React from "react";

interface FilterBarProps {
  onSearchChange: (term: string) => void;
}

const IconSearch = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default function FilterBar({ onSearchChange }: FilterBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch className="w-5 h-5 text-slate-400 dark:text-slate-500" />
      </div>
      <input
        type="text"
        placeholder="Buscar por título, descripción, etiquetas, columna, prioridad..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all"
      />
    </div>
  );
}
