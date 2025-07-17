import { useState } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const fullName = cookies.get('fullName');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    cookies.remove('token');
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    window.location.href = "/auth";
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Peer Group</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-300">{fullName}</span>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;