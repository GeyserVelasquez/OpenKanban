"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import CreateGroupModal from "./CreateGroupModal";
import CreateBoardModal from "./CreateBoardModal";
import Logo from "./Logo";

// --- Icons ---
const IconGroup = ({ className }: { className?: string }) => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBoard = ({ className }: { className?: string }) => (
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
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);

const IconChevronDown = ({ className }: { className?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconPlus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const IconTrash = ({ className }: { className?: string }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const IconEdit = ({ className }: { className?: string }) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconMoreVertical = ({ className }: { className?: string }) => (
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
  onRename: (newTitle: string) => void;
}

const GroupItem = ({
  groupId,
  title,
  boardCount,
  isExpanded,
  onToggle,
  onDelete,
  onCreateBoard,
  onRename,
}: GroupItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  return (
    <div className="select-none">
      <div className="group flex items-center gap-2 py-2 pr-3 pl-3 cursor-pointer transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white">
        <span
          className={`text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-transform duration-200 ${
            isExpanded ? "rotate-0" : "-rotate-90"
          }`}
          onClick={onToggle}
        >
          <IconChevronDown className="w-3 h-3" />
        </span>

        <span className="text-slate-500 dark:text-slate-400" onClick={onToggle}>
          <IconGroup className="w-4 h-4" />
        </span>

        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => {
              if (editValue.trim()) {
                onRename(editValue.trim());
              } else {
                setEditValue(title);
              }
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (editValue.trim()) {
                  onRename(editValue.trim());
                  setIsEditing(false);
                }
              } else if (e.key === "Escape") {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="text-sm font-medium flex-1 bg-white dark:bg-gray-700 border border-cyan-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        ) : (
          <span
            className="text-sm font-medium truncate flex-1"
            onClick={onToggle}
          >
            {title}
          </span>
        )}

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
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-slate-200 dark:border-gray-600 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-600 flex items-center gap-2"
                >
                  <IconEdit className="w-4 h-4" />
                  Renombrar
                </button>
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
  onRename: (newTitle: string) => void;
}

const BoardItem = ({
  boardId,
  title,
  isActive,
  onClick,
  onDelete,
  onRename,
}: BoardItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

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

      <span
        className={
          isActive
            ? "text-cyan-600 dark:text-cyan-400"
            : "text-slate-500 dark:text-slate-400"
        }
      >
        <IconBoard className="w-4 h-4" />
      </span>

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => {
            if (editValue.trim()) {
              onRename(editValue.trim());
            } else {
              setEditValue(title);
            }
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (editValue.trim()) {
                onRename(editValue.trim());
                setIsEditing(false);
              }
            } else if (e.key === "Escape") {
              setEditValue(title);
              setIsEditing(false);
            }
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          className="text-sm font-medium flex-1 bg-white dark:bg-gray-700 border border-cyan-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      ) : (
        <span className="text-sm font-medium truncate flex-1">{title}</span>
      )}

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
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-slate-200 dark:border-gray-600 py-1 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                <IconEdit className="w-4 h-4" />
                Renombrar
              </button>
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
  const {
    workspace,
    createGroup,
    deleteGroup,
    renameGroup,
    createBoard,
    deleteBoard,
    renameBoard,
    setActiveBoard,
  } = useWorkspace();
  const { user, logout } = useAuth();
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(workspace.groups.map((g) => g.id))
  );
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [creatingBoardForGroup, setCreatingBoardForGroup] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userName = user?.name || "Usuario";
  const userEmail = user?.email || "usuario@email.com";
  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

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

  const handleCreateBoard = (groupId: string, title: string) => {
    const boardId = createBoard(groupId, title);
    setActiveBoard(boardId);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <aside className="w-72 h-screen bg-white dark:bg-gray-800 border-r border-slate-100 dark:border-gray-700 flex flex-col overflow-hidden flex-shrink-0 transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Logo size={40} />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              OpenKanban
            </h2>
          </div>

        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Workspace
            </p>
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                No hay grupos todavía
              </p>
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
                  onRename={(newTitle) => renameGroup(group.id, newTitle)}
                  onCreateBoard={() =>
                    setCreatingBoardForGroup({
                      id: group.id,
                      title: group.title,
                    })
                  }
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
                        onRename={(newTitle) => renameBoard(board.id, newTitle)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 flex-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-700 dark:text-white">
                  {userName}
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Cerrar sesión"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                Perfil de Usuario
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Picture and Basic Info */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-gray-700">
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden ring-4 ring-cyan-500/20">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  {userName}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Administrador del Workspace
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Correo Electrónico
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {userEmail}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Rol
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Administrador
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Fecha de Registro
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      15 de Noviembre, 2024
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Último Acceso
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Hoy, 6:49 PM
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Estadísticas
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 text-center border border-cyan-200 dark:border-cyan-800">
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      {workspace.groups.length}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Grupos
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-800">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {workspace.groups.reduce(
                        (acc, g) => acc + g.boards.length,
                        0
                      )}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Tableros
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              ¿Cerrar sesión?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              ¿Estás seguro de que quieres cerrar sesión? Serás redirigido a la
              página de inicio de sesión.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
