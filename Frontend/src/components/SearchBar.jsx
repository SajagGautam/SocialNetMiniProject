import React, { useState } from "react";
import API from "../services/API";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await API.get(`/search?q=${value}`);
      setResults(res.data.users);
      setShowResults(true);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mb-10 relative">
      {/* Searching user */}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for users..."
        className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 shadow-md"
      />

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-10">
          {results.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No users found</p>
          ) : (
            results.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className="block px-6 py-4 hover:bg-indigo-50 transition"
                onClick={() => {
                  setQuery("");
                  setShowResults(false);
                }}
              >
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-gray-600 text-sm">{user.bio || "No bio yet"}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;