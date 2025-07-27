import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700 shadow-md text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-2xl text-green-400 tracking-wide">ZeroWaste</div>

      <div className="flex gap-4 items-center text-sm font-medium">
        {!isAuthenticated() ? (
          <>
            <Link
              to="/"
              className="text-white hover:text-green-400 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-green-400 transition duration-300"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
