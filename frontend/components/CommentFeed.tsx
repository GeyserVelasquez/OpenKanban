"use client";

import React from "react";
import { CommentType } from "@/types/kanban";

interface CommentFeedProps {
  comments: CommentType[];
}

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

export default function CommentFeed({ comments }: CommentFeedProps) {
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

  const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp);

  if (sortedComments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
        <IconMessage className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay comentarios aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedComments.map((comment, index) => (
        <div key={comment.id} className="flex gap-3 group">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <IconMessage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            {index < sortedComments.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 dark:bg-gray-600 mt-2" />
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-3 group-hover:bg-slate-100 dark:group-hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-purple-600 dark:text-purple-400">
                  {comment.userId}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
