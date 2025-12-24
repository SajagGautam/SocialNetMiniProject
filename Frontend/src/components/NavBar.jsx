import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-bold">
          SocialNet
        </Link>

        <div className="flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/" className="text-white text-xl font-medium hover:text-purple-200 transition">
                Feed
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="text-white text-xl font-medium hover:text-purple-200 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white text-xl font-medium hover:text-purple-200 transition">
                Login
              </Link>
              <Link to="/register" className="text-white text-xl font-medium hover:text-purple-200 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;