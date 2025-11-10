import { Activity } from "lucide-react";
import { useState } from "react";
import type { MouseEvent } from 'react';
import AuthModule from "./components/authmodule.tsx";
import { useAuth } from './auth/AuthContext';

const AuthModuleAny: any = AuthModule;

const Header = () => {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const openAuth = () => setAuthOpen(true);
  const closeAuth = () => setAuthOpen(false);
  const { user, logout } = useAuth();
  const ghostIconButtonClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 w-10 p-0 hover:bg-gray-100/50";
  
  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emergency text-red-500" />
            <span className="text-lg font-bold text-foreground">Disaster Response Network</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#trust-section"
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                const el = document.getElementById('trust-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-sm font-medium text-foreground hover:text-emergency transition-colors"
            >
              How It Works
            </a>
            <a
              href="#live-updates"
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                const el = document.getElementById('live-updates');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-sm font-medium text-foreground hover:text-emergency transition-colors"
            >
              Our Impact
            </a>
            <a
              href="#campains"
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                const el = document.getElementById('campains');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-black text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-gray-800 transition"
            >
              Donate Now
            </a>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">{user.username}</span>
                <button onClick={async () => { await logout(); }} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Logout</button>
              </div>
            ) : (
              <button onClick={openAuth} className="text-sm font-medium text-foreground hover:text-emergency transition-colors">
                Login
              </button>
            )}
          </nav>

          <button className={`md:hidden ${ghostIconButtonClasses}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    {isAuthOpen && <AuthModuleAny onClose={closeAuth} />}
    </>
  );
};

export default Header;