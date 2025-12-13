import React from "react";

export default function Navbar() {
    return (
<header className="w-full flex justify-center pt-6 relative z-50">
  <div className="bg-white border border-gray-200 rounded-full shadow-md px-8 py-3 flex items-center gap-6">

    {/* LOGO */}
    <div className="flex items-center gap-2">
      <span className="text-[22px] font-extrabold text-[#e60000]">
        studex
      </span>
      <span className="text-[11px] text-gray-500">
        25 years
      </span>
    </div>

    {/* NAV LINKS */}
    <nav className="hidden lg:flex items-center gap-6 text-[14px] text-gray-700">

      {[
        "ICT Jobs",
        "HR & Admin",
        "Procurement",
        "Engineering",
        "Internship ",
        "Government ",
      ].map((item) => (
        <button
          key={item}
          className="flex items-center gap-1 hover:text-black"
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

      <a className="flex items-center gap-1 hover:text-black">
        Partners
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </a>
    </nav>

    {/* DIVIDER */}
    <div className="hidden lg:block h-6 w-px bg-gray-300" />

    {/* RIGHT ACTIONS */}
    <div className="flex items-center gap-3 text-[14px]">
      <button className="hover:text-black">EN</button>

      <button className="px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50">
        Log in
      </button>

      <button className="px-5 py-1.5 bg-[#ff444f] text-white rounded-full hover:bg-[#e63e47] font-medium">
        Open account
      </button>
    </div>

  </div>
</header>


    );
}