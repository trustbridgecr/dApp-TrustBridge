"use client";

import React from "react";
import Link from "next/link";

const HeaderHome: React.FC = () => {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <div className="flex flex-1 justify-end">
        <Link href="/about-us">
          <button className="rounded-md border border-emerald-800 bg-black px-4 py-1.5 text-emerald-800 font-medium transition-colors duration-200 hover:bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-800">
            About Us
          </button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderHome;
