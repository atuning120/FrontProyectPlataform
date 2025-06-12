import React from "react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[320px] max-w-[90vw] animate-fadein">
        <div className="text-lg mb-6 text-gray-800">{message || "¿Estás seguro?"}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadein {
          animation: fadein 0.25s;
        }
      `}</style>
    </div>
  );
}
