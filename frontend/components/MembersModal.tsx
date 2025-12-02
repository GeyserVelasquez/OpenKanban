"use client";

import React from "react";
import { MemberType } from "@/types/kanban";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberType[];
  currentUsername: string;
  boardName: string;
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

const IconCrown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarColor = (username: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function MembersModal({
  isOpen,
  onClose,
  members,
  currentUsername,
  boardName,
}: MembersModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
              Miembros del Tablero
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {boardName} • {members.length} {members.length === 1 ? "miembro" : "miembros"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(
                      member.username
                    )}`}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                
                {/* Owner Badge */}
                {member.role === "owner" && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <IconCrown className="w-3 h-3 text-yellow-900 dark:text-yellow-950" />
                  </div>
                )}

                {/* Current User Indicator */}
                {member.username === currentUsername && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {member.name}
                  </h3>
                  {member.username === currentUsername && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                      Tú
                    </span>
                  )}
                  {member.role === "owner" && (
                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <IconCrown className="w-3 h-3" />
                      Creador
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  @{member.username}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Se unió el {formatDate(member.joinedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
