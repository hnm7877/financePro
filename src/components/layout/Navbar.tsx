"use client";

import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export function Navbar() {
  const { user, logout } = useUserStore();

  return (
    <header className="w-full border-b border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-primary">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            FinTrack <span className="text-primary">PRO</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {!user && (
            <>
              <Link
                href="#"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Solutions
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Tarifs
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Sécurité
              </Link>
            </>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-primary"
            >
              Tableau de Bord ({user.companyName})
            </Link>
          )}
          <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
          {user ? (
            <button
              onClick={logout}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <p className="text-sm text-gray-500">Déjà inscrit ?</p>
              <Link
                href="/login"
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-all"
              >
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

