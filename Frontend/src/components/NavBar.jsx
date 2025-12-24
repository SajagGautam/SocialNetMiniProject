import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-2xl font-bold">
            SocialNet
          </Link>
          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/" className="text-white hover:text-gray-200 transition">
                  Feed
                </Link>
                <Link to={`/profile/${user.id}`} className="text-white hover:text-gray-200 transition">
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200 transition">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-gray-200 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;