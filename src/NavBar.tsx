import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import "./navbar.css";
import AuthModule from "./components/authmodule.tsx";
import { useAuth } from './auth/AuthContext';

const AuthModuleAny: any = AuthModule;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { user, logout } = useAuth();
  const handleLoginClick = () => {
    console.log('Login button clicked — opening auth modal');
    setAuthModalOpen(true);
  };

  const navItems = [
    { label: 'How it Works', id: 'trust-section' },
    { label: 'Our Impacts', id: 'live-updates' },
    { label: 'Donate Now', id: 'campains' },
  ];

  const scrollToSection = (e: MouseEvent, id: string) => {
    e.preventDefault();
    console.log('Nav click for', id);
    const el = document.getElementById(id);
    if (el) {
      console.log('Found element, scrolling', el);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    } else {
      console.warn('Element not found for id', id);
      window.location.hash = id;
    }
  };

  return (
    <>
      <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm border-blue-950"
        : "bg-transparent border-transparent"
      }`}
      >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <span className="text-red-500 text-lg">❤️</span>
        <h1
          className={`font-bold transition-colors ${
          scrolled ? "text-sky-950 hover:text-gray-900" : "text-sky-50"
          }`}
        >
          Love And Needs
        </h1>
        </div>

        <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`font-semibold transition-colors ${
                scrolled
                  ? "text-sky-950 hover:text-gray-900"
                  : "text-sky-50 hover:text-gray-100"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}

        <li>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.username}</span>
              <button onClick={async () => await logout()} className="bg-red-500 text-white px-3 py-1 rounded-md">Logout</button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
            >
              Login
            </button>
          )}
        </li>
        </ul>
      </div>
      </nav>

      {isAuthModalOpen && <AuthModuleAny onClose={() => setAuthModalOpen(false)} />}
    </>
  );
};

export default Navbar;