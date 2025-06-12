// src/components/Notification.js
import { useEffect } from "react";

export default function Notification({ message, type = "success", onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg
        ${type === "success" ? "bg-green-100 border border-green-400 text-green-900" : ""}
        ${type === "error" ? "bg-red-100 border border-red-400 text-red-900" : ""}
        flex items-center gap-3 animate-slide-in
      `}
      style={{
        animation: "slide-in 0.3s",
      }}
    >
      <span className="font-semibold">{type === "success" ? "✓" : "!"}</span>
      <span>{message}</span>
      <button
        className="ml-auto text-xl leading-none font-bold text-gray-400 hover:text-gray-700"
        onClick={onClose}
        aria-label="Cerrar notificación"
        tabIndex={0}
      >
        &times;
      </button>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100px); opacity: 0;}
          to   { transform: translateX(0); opacity: 1;}
        }
      `}</style>
    </div>
  );
}
