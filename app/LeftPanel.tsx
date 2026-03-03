"use client";
import { useState } from "react";
import {
  Home,
  Heart,
  Grid2X2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FolderSync,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", label: "Home", icon: <Home size={20} /> },
  { path: "/favourites", label: "Favourites", icon: <Heart size={20} /> },
  { path: "/categories", label: "Categories", icon: <Grid2X2 size={20} /> },
  { path: "/completed", label: "Completed", icon: <CheckCircle size={20} /> },
  { path: "/transfer", label: "Transfer", icon: <FolderSync size={20} /> },
];

const LeftPanel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();
  console.log(location);

  return (
    <aside
      className={`${
        collapsed ? "w-18" : "w-60"
      } transition-all duration-300 ease-in-out min-h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0 overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center px-0" : "justify-between px-4"
        } py-5 border-b border-gray-100 min-h-16`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* X badge */}
          <div className="w-9 h-9 rounded-md bg-linear-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white font-bold text-[17px] ">X</span>
          </div>

          {/* Company name */}
          {!collapsed && (
            <span className="font-bold text-base text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">
              <span className="text-gray-700">Stream</span>
            </span>
          )}
        </div>

        {/* Collapse button */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer duration-200"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2">
        {navItems.map(({ path, label, icon }) => {
          const isActive = location.split("/")[1] === path.split("/")[1]; // Check if the first segment matches
          return (
            <Link
              key={path}
              href={path}
              title={collapsed ? label : undefined}
              className={`relative flex items-center gap-3 rounded-[10px] text-sm font-medium transition-colors duration-150 whitespace-nowrap overflow-hidden
                ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-[#f0f4ff] text-[#1a1a2e] font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-[20%] h-[60%] w-0.75 rounded-r-sm bg-[#1a1a2e]" />
              )}
              <span className="shrink-0 flex">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
          className="mx-auto mb-3 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-400 text-[11px] text-gray-700 tracking-wide">
          © 2026 X Stream
        </div>
      )}
    </aside>
  );
};

export default LeftPanel;
