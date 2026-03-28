import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER (global) */}
      <Header />

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}