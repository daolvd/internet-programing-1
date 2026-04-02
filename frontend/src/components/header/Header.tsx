import { useEffect, useState } from "react";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";

const THEME_STORAGE_KEY = "flashcard-theme";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
              F
            </div>
            <span className="truncate">Flashcard App</span>
          </div>

          <div className="hidden lg:block">
            <Navigation />
          </div>
        </div>

        <div className="hidden min-w-0 items-center gap-4 md:flex">
          <SearchBar />

          <button
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            onClick={toggleTheme}
            className={`relative inline-flex h-10 w-[74px] items-center rounded-full border px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isDarkMode ? "border-blue-500 bg-slate-900" : "border-gray-200 bg-gray-100"
            }`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sr-only">{isDarkMode ? "Light mode" : "Dark mode"}</span>
            <span className="pointer-events-none flex w-full items-center justify-between px-1">
              <Moon className={`h-4 w-4 ${isDarkMode ? "text-slate-500" : "text-slate-700"}`} />
              <Sun className={`h-4 w-4 ${isDarkMode ? "text-amber-300" : "text-amber-500"}`} />
            </span>
            <span
              className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform ${
                isDarkMode ? "translate-x-[34px]" : "translate-x-0"
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </span>
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          <img
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            className="h-10 w-10 rounded-full border"
          />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 lg:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 lg:hidden">
          <div className="space-y-4">
            <SearchBar />
            <Navigation />
            <button
              type="button"
              role="switch"
              aria-checked={isDarkMode}
              onClick={toggleTheme}
              className={`relative inline-flex h-10 w-[74px] items-center rounded-full border px-1 transition-colors ${
                isDarkMode ? "border-blue-500 bg-slate-900" : "border-gray-200 bg-gray-100"
              }`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="sr-only">{isDarkMode ? "Light mode" : "Dark mode"}</span>
              <span className="pointer-events-none flex w-full items-center justify-between px-1">
                <Moon className={`h-4 w-4 ${isDarkMode ? "text-slate-500" : "text-slate-700"}`} />
                <Sun className={`h-4 w-4 ${isDarkMode ? "text-amber-300" : "text-amber-500"}`} />
              </span>
              <span
                className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform ${
                  isDarkMode ? "translate-x-[34px]" : "translate-x-0"
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </span>
            </button>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <img
                src="https://i.pravatar.cc/40"
                alt="User avatar"
                className="h-10 w-10 rounded-full border"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
