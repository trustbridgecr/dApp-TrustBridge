"use client";

<<<<<<< feat/about-us-page-141
import React from "react";
import Link from "next/link";

const HeaderHome: React.FC = () => {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <div className="flex flex-1 justify-end">
        <Link href="/about-us">
          <button className="rounded-md border border-emerald-700 bg-black px-4 py-1.5 text-emerald-400 font-medium transition-colors duration-200 hover:bg-emerald-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            About Us
          </button>
        </Link>
      </div>
    </header>
=======
export function HeaderHome() {
  return (
    <header className="flex h-14 items-center justify-start border-b bg-muted/40 px-4 lg:px-6"></header>
>>>>>>> develop
  );
};

export default HeaderHome;
