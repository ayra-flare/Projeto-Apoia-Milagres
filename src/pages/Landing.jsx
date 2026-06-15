import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#E0E0E0]">
        <button className="p-2">
          <Menu size={22} className="text-[#FF7F32]" />
        </button>
        <span className="font-bold text-lg tracking-wide text-[#FF7F32]">
          APOIA MILAGRES
        </span>
        <Link to="/login">
          <Button className="bg-[#FF7F32] hover:bg-[#FF7F32]/90 text-white rounded-full px-6 font-bold text-sm">
            LOGIN
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531844251246-9a1bfaaeeb9a?w=1200&h=800&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold text-white tracking-wider drop-shadow-lg">
          BEM VINDO!
        </h1>
      </div>
    </div>
  );
}