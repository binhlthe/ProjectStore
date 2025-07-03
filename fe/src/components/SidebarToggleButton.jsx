// src/components/SidebarToggleButton.jsx
import React from "react";

function SidebarToggleButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`block md:hidden p-2 ${className}`}
      aria-label="Toggle Sidebar"
    >
      <svg
        className="w-6 h-6 text-black"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

export default SidebarToggleButton;
