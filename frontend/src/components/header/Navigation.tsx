import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Review", path: "/review" },
  { label: "Decks", path: "/decks" },
  { label: "Statistics", path: "/stats" },
];

export default function Navigation() {
  return (
    <nav className="flex flex-col gap-3 text-sm font-medium lg:flex-row lg:gap-6">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `relative rounded-md pb-1 transition ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && (
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-600" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
