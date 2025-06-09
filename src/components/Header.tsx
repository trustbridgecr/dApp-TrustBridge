'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-emerald-400 text-xl font-bold hover:text-emerald-300 transition-colors">
              TrustBridge
            </Link>
          </div>

          {/* Desktop "Powered by" Badge */}
          <div className="hidden md:flex items-center">
            <div className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-600/30">
              Powered by Stellar Blockchain
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/about"
              className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-600/30 hover:border-emerald-500/50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Terms
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-emerald-400 focus:outline-none focus:text-emerald-400 transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2 border border-gray-800 shadow-xl">
              {/* Mobile "Powered by" Badge */}
              <div className="flex items-center justify-center py-3 border-b border-gray-800 mb-2">
                <div className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-600/30">
                  Powered by Stellar Blockchain
                </div>
              </div>
              
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 block px-3 py-2 rounded-md text-base font-medium border border-emerald-600/30 hover:border-emerald-500/50 transition-all duration-200 mx-2 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}