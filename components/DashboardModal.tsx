"use client";

import React from "react";
import TaskChart from "./TaskChart";
import ProgressBar from "./ProgressBar";

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: {
    labels: string[];
    datasets: any[];
  };
  completed: number;
  total: number;
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

const IconChart = ({ className }: { className?: string }) => (
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
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

export default function DashboardModal({
  isOpen,
  onClose,
  chartData,
  completed,
  total,
}: DashboardModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconChart className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Estadísticas del Tablero
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Distribución de Tareas
            </h3>
            <TaskChart data={chartData} />
          </div>

          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Progreso de Completitud
            </h3>
            <ProgressBar completed={completed} total={total} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {total}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Total Tareas
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completed}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                Completadas
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {total - completed}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Pendientes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
