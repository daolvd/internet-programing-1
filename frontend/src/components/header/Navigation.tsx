import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Review", path: "/review" },
  { label: "Decks", path: "/decks" },
  { label: "Statistics", path: "/stats" },
];

export default function Navigation() {
  return (
    <nav className="flex gap-6 text-sm font-medium">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `relative pb-1 ${
              isActive
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600"></span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}