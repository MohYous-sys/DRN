import React, { useState, useEffect } from "react";
import "./navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          {["About", "Impact", "Our Causes", "Get Involved"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className={`font-semibold transition-colors ${
                  scrolled
                    ? "text-sky-950 hover:text-gray-900"
                    : "text-sky-50 hover:text-gray-100"
                }`}
              >
                {item}
              </a>
            </li>
          ))}

          <li>
            <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition">
              Donate
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;