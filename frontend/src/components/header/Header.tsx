import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            📘
          </div>
          Flashcard App
        </div>

        {/* Navigation */}
        <Navigation />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <SearchBar />

        {/* Notification */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
}