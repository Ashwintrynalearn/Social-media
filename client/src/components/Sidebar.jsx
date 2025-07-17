import { NavLink } from "react-router-dom";
import { Home, MessageSquare, User, Search } from "lucide-react";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Sidebar() {
  const userId = cookies.get('userId');

  return (
    <aside className="h-screen sticky w-60 top-0 p-4 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700">
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-gray-800 dark:text-gray-300 
            ${isActive ? "bg-gray-300 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`
          }
        >
          <Home className="w-5 h-5" /> Home
        </NavLink>
        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-gray-800 dark:text-gray-300 
            ${isActive ? "bg-gray-300 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`
          }
        >
          <Search className="w-5 h-5" /> Discover
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-gray-800 dark:text-gray-300 
            ${isActive ? "bg-gray-300 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`
          }
        >
          <MessageSquare className="w-5 h-5" /> Messages
        </NavLink>
        <NavLink
          to={`/profile/${userId}`}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg text-gray-800 dark:text-gray-300 
            ${isActive ? "bg-gray-300 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`
          }
        >
          <User className="w-5 h-5" /> Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;