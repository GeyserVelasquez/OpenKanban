"use client";

import React, { useState } from "react";

interface CommentInputProps {
  onCommentSubmit: (text: string) => void;
}

export default function CommentInput({ onCommentSubmit }: CommentInputProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (commentText.trim()) {
      onCommentSubmit(commentText.trim());
      setCommentText("");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Escribe un comentario..."
        rows={3}
        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:text-white resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
          }
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!commentText.trim()}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
      >
        Añadir Comentario
      </button>
    </div>
  );
}
