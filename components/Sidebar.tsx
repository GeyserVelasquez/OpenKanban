"use client";

import React, { useState } from "react";

// --- Icons (Inline for portability) ---
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

const IconFolder = ({ className }: { className?: string }) => (
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
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
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

// --- Mock Data ---
type NodeType = "group" | "folder" | "board";

interface TreeNode {
  id: string;
  title: string;
  type: NodeType;
  children?: TreeNode[];
  isActive?: boolean;
}

const mockData: TreeNode[] = [
  {
    id: "g1",
    title: "Engineering Team",
    type: "group",
    children: [
      {
        id: "f1",
        title: "Frontend Projects",
        type: "folder",
        children: [
          { id: "b1", title: "OpenKanban Master", type: "board", isActive: true },
          { id: "b2", title: "Design System", type: "board" },
        ],
      },
      {
        id: "f2",
        title: "Backend Services",
        type: "folder",
        children: [
          { id: "b3", title: "API Gateway", type: "board" },
        ],
      },
    ],
  },
  {
    id: "g2",
    title: "Marketing",
    type: "group",
    children: [
      { id: "b4", title: "Q4 Campaigns", type: "board" },
    ],
  },
];

const TreeNodeItem = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getIcon = () => {
    switch (node.type) {
      case "group": return <IconGroup className="w-4 h-4" />;
      case "folder": return <IconFolder className="w-4 h-4" />;
      case "board": return <IconBoard className="w-4 h-4" />;
      default: return null;
    }
  };

  const paddingLeft = `${depth * 12 + 12}px`;

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center gap-2 py-2 pr-3 cursor-pointer transition-colors duration-200
          ${node.isActive 
            ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-r-2 border-cyan-500" 
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"}`}
        style={{ paddingLeft }}
        onClick={hasChildren ? handleToggle : undefined}
      >
        <span 
          className={`text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
          onClick={hasChildren ? handleToggle : undefined}
        >
          {hasChildren ? <IconChevronDown className="w-3 h-3" /> : <div className="w-3 h-3" />}
        </span>
        
        <span className={node.isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}>
          {getIcon()}
        </span>
        
        <span className="text-sm font-medium truncate flex-1">
          {node.title}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-white dark:bg-gray-800 border-r border-slate-100 dark:border-gray-700 flex flex-col overflow-hidden flex-shrink-0 transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">OpenKanban</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Workspace Pro</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-4 mb-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
        </div>
        {mockData.map((node) => (
          <TreeNodeItem key={node.id} node={node} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-gray-700">
        <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-slate-600 dark:text-slate-300">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-600 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-700 dark:text-white">Jane Doe</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Pro Plan</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
