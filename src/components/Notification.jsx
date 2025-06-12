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
      className={`fixed top-6 right-6 z-50 min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg
    flex items-center gap-3 animate-slide-in`}
      style={{
        backgroundColor:
          type === "success" ? "#059669" :   // green-600
            type === "error" ? "#dc2626" :     // red-600
              type === "info" ? "#2563eb" :      // blue-600
                type === "warning" ? "#facc15" :   // yellow-400
                  "#111827",                        // fallback: gray-900
        border: "1px solid",
        borderColor:
          type === "success" ? "#065f46" :   // green-800
            type === "error" ? "#991b1b" :     // red-800
              type === "info" ? "#1e3a8a" :      // blue-900
                type === "warning" ? "#a16207" :   // yellow-700
                  "#1f2937",                        // fallback: gray-800
        color: ["warning"].includes(type) ? "#fff" : "#fff",
        animation: "slide-in 0.3s"
      }}
    >

      <span className="font-semibold text-2xl text-white">
        {type === "success" ? "✓" : type === "error" ? "!" : type === "info" ? "ℹ" : "⚠"}
      </span>
      <span className="flex-1 text-white">{message}</span>
      <button
        className={`ml-auto text-xl leading-none font-bold text-white hover:text-gray-200`}
        onClick={onClose}
        aria-label="Cerrar notificación"
        tabIndex={0}
      >
        &times;
      </button>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
