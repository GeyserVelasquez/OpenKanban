"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
}

export default function TaskChart({ data }: TaskChartProps) {
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#64748b",
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
}
