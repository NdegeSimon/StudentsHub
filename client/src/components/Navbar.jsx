import React from "react";

export default function Navbar() {
    return (
<header className="w-full flex justify-center pt-6 relative z-50">
  <div className="bg-gray-800 border border-gray-700 rounded-full shadow-lg px-8 py-3 flex items-center gap-6">

    {/* LOGO */}
    <div className="flex items-center gap-2">
      <span className="text-[22px] font-extrabold text-purple-400">
        studex
      </span>
    </div>

    {/* NAV LINKS */}
    <nav className="hidden lg:flex items-center gap-6 text-[14px] text-gray-300">
      {[
        "ICT Jobs",
        "HR & Admin",
        "Procurement",
        "Engineering",
        "Internship",
        "Government",
      ].map((item) => (
        <button
          key={item}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {item}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      ))}
    </nav>

    {/* DIVIDER */}
    <div className="hidden lg:block h-6 w-px bg-gray-600" />

    {/* RIGHT ACTIONS */}
    <div className="flex items-center gap-3 text-[14px]">
      <button className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:opacity-90 font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 shadow-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
        </svg>
        Go Premium
      </button>
    </div>

  </div>
</header>


    );
}