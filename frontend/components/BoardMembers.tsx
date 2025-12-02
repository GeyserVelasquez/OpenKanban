"use client";

import React from "react";
import { MemberType } from "@/types/kanban";

interface BoardMembersProps {
  members: MemberType[];
  currentUsername: string;
  onClick: () => void;
}

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

export default function BoardMembers({ members, currentUsername, onClick }: BoardMembersProps) {
  const maxVisibleMembers = 3;
  const visibleMembers = members.slice(0, maxVisibleMembers);
  const remainingCount = members.length - maxVisibleMembers;

  if (members.length === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-xl transition-colors"
    >
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Miembros
      </span>
      
      <div className="flex items-center">
        {/* Member Avatars */}
        <div className="flex -space-x-2">
          {visibleMembers.map((member, index) => (
            <div
              key={member.id}
              className="relative"
              style={{ zIndex: members.length - index }}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(
                    member.username
                  )}`}
                >
                  {getInitials(member.name)}
                </div>
              )}
              
              {/* Owner Badge */}
              {member.role === "owner" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center border border-white dark:border-gray-800">
                  <IconCrown className="w-2.5 h-2.5 text-yellow-900 dark:text-yellow-950" />
                </div>
              )}

              {/* Current User Indicator */}
              {member.username === currentUsername && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
          ))}
        </div>

        {/* Show More Indicator */}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 ml-0.5">
            +{remainingCount}
          </div>
        )}
      </div>
    </button>
  );
}
