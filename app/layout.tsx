import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OpenKanban Pro Master",
  description: "Professional Kanban Board Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider>
          <WorkspaceProvider>
            {children}
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
