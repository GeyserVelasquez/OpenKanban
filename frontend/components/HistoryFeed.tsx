"use client";

import React from "react";
import { HistoryLogType } from "@/types/kanban";

interface HistoryFeedProps {
  history: HistoryLogType[];
}

const IconClock = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function HistoryFeed({ history }: HistoryFeedProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const sortedHistory = history ? [...history].sort((a, b) => b.timestamp - a.timestamp) : [];

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
        <IconClock className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay historial de cambios</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedHistory.map((log, index) => (
        <div key={index} className="flex gap-3 group">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
              <IconClock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            {index < sortedHistory.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 dark:bg-gray-600 mt-2" />
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-3 group-hover:bg-slate-100 dark:group-hover:bg-gray-600 transition-colors">
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-1">
                {log.message.split(/(\*\*.*?\*\*)/).map((part, i) => 
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i} className="font-bold text-slate-900 dark:text-white">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                  {log.userId}
                </span>
                <span>•</span>
                <span>{formatTimestamp(log.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
