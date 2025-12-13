import React from "react";

export default function Navbar() {
    return (
      <header className="w-full bg-white border-b" >
       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
         <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-600">STUDEX</span>
          <span className="text-xs text-gray-500">1 years</span>
         </div>
       </div>
       <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
      <a href="#" className="hover:text-black">ICT Jobs</a>
      <a href="#" className="hover:text-black">HR & Admin</a>
      <a href="#" className="hover:text-black">Procurement</a>
      <a href="#" className="hover:text-black">Internship </a>
      <a href="#" className="hover:text-black flex items-center gap-1">
        Partners <span>↗</span>
      </a>
    </nav>

     <div className="flex items-center gap-4">
      <button className="text-sm text-gray-700 hover:text-black">EN</button>

      <button className="px-4 py-2 text-sm border rounded-full hover:bg-gray-100">
        Log in
      </button>

      <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600">
        Open account
      </button>
    </div>
      </header>

    );
}