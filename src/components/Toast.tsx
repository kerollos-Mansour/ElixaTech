"use client";

import { useState, useEffect, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        pointerEvents: "none"
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="glass animate-slide-in" style={{
            padding: "1rem 1.5rem",
            borderRadius: "var(--radius)",
            background: toast.type === "success" ? "rgba(34, 197, 94, 0.9)" : 
                       toast.type === "error" ? "rgba(239, 68, 68, 0.9)" : 
                       "rgba(99, 102, 241, 0.9)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            pointerEvents: "auto",
            minWidth: "250px",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <span>{toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}</span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
