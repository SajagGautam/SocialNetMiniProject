import React, { useState } from "react";
import API from "../services/API";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    try {
      await API.post("/posts", { content: content.trim() });
      setContent("");
      onPostCreated(); 
    } catch (err) {
      alert("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">What's on your mind?</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with your friends..."
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition duration-200 resize-none"
          rows="5"
          required
          disabled={loading}
        />

        <div className="mt-6 text-right">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-purple-800 text-white font-bold py-4 px-10 rounded-xl hover:opacity-90 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;