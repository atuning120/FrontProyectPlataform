import React from "react";

export default function ToggleButton({
  isVisible,
  onToggle,
  showText,
  hideText,
  className,
}) {
  return (
    <button
      onClick={onToggle}
      className={`${className} w-full py-2 rounded-lg hover:transition`}
    >
      {isVisible ? hideText : showText}
    </button>
  );
}
