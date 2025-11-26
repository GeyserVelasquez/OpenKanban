"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface BoardHeaderProps {
  boardName: string;
  boardColor: string;
  onColorChange: (newColor: string) => void;
  onCreateTask: () => void;
}

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

const IconFilter = ({ className }: { className?: string }) => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconPalette = ({ className }: { className?: string }) => (
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
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const IconSun = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const boardColors = [
  { name: "Azul Claro", class: "bg-blue-50 dark:bg-blue-900/20" },
  { name: "Verde Claro", class: "bg-green-50 dark:bg-green-900/20" },
  { name: "Rosa Claro", class: "bg-pink-50 dark:bg-pink-900/20" },
  { name: "Púrpura Claro", class: "bg-purple-50 dark:bg-purple-900/20" },
  { name: "Gris Claro", class: "bg-gray-50 dark:bg-gray-800" },
];

export default function BoardHeader({ boardName, boardColor, onColorChange, onCreateTask }: BoardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 flex-shrink-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-200 dark:shadow-cyan-900/50">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
            {boardName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Active
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Last updated 2h ago</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden hover:z-10 hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=c0aede`} 
                 alt={`User ${i}`} 
                 className="w-full h-full"
               />
            </div>
          ))}
          <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-colors">
            +5
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-gray-700"></div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-600">
            <IconFilter className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-600"
              title="Cambiar color del tablero"
            >
              <IconPalette className="w-5 h-5" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 p-4 w-64 z-50">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Color del Tablero</h3>
                <div className="grid grid-cols-5 gap-2">
                  {boardColors.map((color) => (
                    <button
                      key={color.class}
                      onClick={() => {
                        onColorChange(color.class);
                        setShowColorPicker(false);
                      }}
                      className={`w-10 h-10 rounded-xl ${color.class} border-2 ${
                        boardColor === color.class
                          ? "border-cyan-500 ring-2 ring-cyan-200 dark:ring-cyan-800"
                          : "border-slate-200 dark:border-gray-600 hover:border-cyan-300 dark:hover:border-cyan-700"
                      } transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-gray-600"
              title="Cambiar tema"
            >
              <IconSun className="w-5 h-5" />
            </button>

            {showThemePicker && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 p-3 w-48 z-50">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Tema</h3>
                <div className="space-y-1">
                  {[
                    { value: "light", label: "Claro" },
                    { value: "dark", label: "Oscuro" },
                    { value: "playful", label: "Playful" },
                  ].map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value as any);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        theme === themeOption.value
                          ? "bg-cyan-500 text-white"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{themeOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={onCreateTask}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-cyan-500/25 dark:shadow-cyan-900/50 transition-all active:scale-95"
          >
            <IconPlus className="w-5 h-5" />
            <span>Crear Tarea</span>
          </button>
        </div>
      </div>
    </header>
  );
}
