"use client";

import React from "react";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Progreso General
        </span>
        <span className="font-bold text-cyan-600 dark:text-cyan-400">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="text-xs font-bold text-white">
              {completed}/{total}
            </span>
          )}
        </div>
      </div>
      {percentage <= 15 && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
          {completed} de {total} tareas completadas
        </div>
      )}
    </div>
  );
}
