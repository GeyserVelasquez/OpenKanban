"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import CreateGroupModal from "./CreateGroupModal";
import CreateBoardModal from "./CreateBoardModal";

// --- Icons ---
const IconGroup = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBoard = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);

const IconChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const IconTrash = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const IconMoreVertical = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

interface GroupItemProps {
  groupId: string;
  title: string;
  boardCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onCreateBoard: () => void;
}

const GroupItem = ({ groupId, title, boardCount, isExpanded, onToggle, onDelete, onCreateBoard }: GroupItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="select-none">
      <div className="group flex items-center gap-2 py-2 pr-3 pl-3 cursor-pointer transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white">
        <span 
          className={`text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
          onClick={onToggle}
        >
          <IconChevronDown className="w-3 h-3" />
        </span>
        
        <span className="text-slate-500 dark:text-slate-400" onClick={onToggle}>
          <IconGroup className="w-4 h-4" />
        </span>
        
        <span className="text-sm font-medium truncate flex-1" onClick={onToggle}>
          {title}
        </span>

        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
          {boardCount}
        </span>

        <button
          onClick={onCreateBoard}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-all"
          title="Crear tablero"
        >
          <IconPlus className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-all"
          >
            <IconMoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-slate-200 dark:border-gray-600 py-1 z-20">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <IconTrash className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface BoardItemProps {
  boardId: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const BoardItem = ({ boardId, title, isActive, onClick, onDelete }: BoardItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`group flex items-center gap-2 py-2 pr-3 pl-9 cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-r-2 border-cyan-500"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
      }`}
      onClick={onClick}
    >
      <div className="w-3 h-3" />
      
      <span className={isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}>
        <IconBoard className="w-4 h-4" />
      </span>
      
      <span className="text-sm font-medium truncate flex-1">
        {title}
      </span>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-all"
        >
          <IconMoreVertical className="w-3.5 h-3.5" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-slate-200 dark:border-gray-600 py-1 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <IconTrash className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const { workspace, createGroup, deleteGroup, createBoard, deleteBoard, setActiveBoard } = useWorkspace();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(workspace.groups.map(g => g.id)));
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [creatingBoardForGroup, setCreatingBoardForGroup] = useState<{ id: string; title: string } | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleCreateGroup = (title: string) => {
    createGroup(title);
  };

  const handleCreateBoard = async (groupId: string, title: string) => {
    const boardId = await createBoard(groupId, title);
    setActiveBoard(boardId);
  };

  return (
    <>
      <aside className="w-72 h-screen bg-white dark:bg-gray-800 border-r border-slate-100 dark:border-gray-700 flex flex-col overflow-hidden flex-shrink-0 transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">OpenKanban</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Workspace Pro</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Workspace</p>
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Crear grupo"
            >
              <IconPlus className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          {workspace.groups.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No hay grupos todavía</p>
              <button
                onClick={() => setIsCreatingGroup(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Crear Primer Grupo
              </button>
            </div>
          ) : (
            workspace.groups.map((group) => (
              <div key={group.id}>
                <GroupItem
                  groupId={group.id}
                  title={group.title}
                  boardCount={group.boards.length}
                  isExpanded={expandedGroups.has(group.id)}
                  onToggle={() => toggleGroup(group.id)}
                  onDelete={() => deleteGroup(group.id)}
                  onCreateBoard={() => setCreatingBoardForGroup({ id: group.id, title: group.title })}
                />

                {expandedGroups.has(group.id) && (
                  <div className="flex flex-col">
                    {group.boards.map((board) => (
                      <BoardItem
                        key={board.id}
                        boardId={board.id}
                        title={board.name}
                        isActive={workspace.activeBoardId === board.id}
                        onClick={() => setActiveBoard(board.id)}
                        onDelete={() => deleteBoard(board.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-gray-700">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-600 dark:text-slate-300">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden">
              <img src="/images/profile.jpg" alt="Manuel Casique" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-700 dark:text-white">Manuel Casique</span>
            </div>
          </button>
        </div>
      </aside>

      <CreateGroupModal
        isOpen={isCreatingGroup}
        onClose={() => setIsCreatingGroup(false)}
        onCreate={handleCreateGroup}
      />

      <CreateBoardModal
        isOpen={creatingBoardForGroup !== null}
        onClose={() => setCreatingBoardForGroup(null)}
        onCreate={(title) => {
          if (creatingBoardForGroup) {
            handleCreateBoard(creatingBoardForGroup.id, title);
          }
        }}
        groupTitle={creatingBoardForGroup?.title || ""}
      />
    </>
  );
}
