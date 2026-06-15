import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import { User } from "lucide-react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-[68px]" : "ml-[240px]"
        }`}
      >
        <div className="flex">
          <main className="flex-1 min-h-screen border-x border-border max-w-[600px] mx-auto lg:mx-0">
            <div className="sticky top-0 z-30 bg-[#E0E0E0] backdrop-blur-xl border-b border-border px-4 py-2.5 flex items-center justify-between">
              <span className="font-bold text-sm text-[#F47920] tracking-wide">APOIA MILAGRES</span>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-full bg-[#F47920] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
                <div className="w-7 h-7 rounded-full bg-[#F47920] flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
              </div>
            </div>
            <Outlet />
          </main>
          <aside className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-0 pt-3 px-4">
              <RightPanel />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}