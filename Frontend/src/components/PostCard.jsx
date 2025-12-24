import React, { useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/API";
import { AuthContext } from "../context/AuthContext";

const PostCard = ({ post, onUpdate }) => {
  const { user: currentUser } = useContext(AuthContext);

  const isOwner = currentUser && post.author._id === currentUser.id;

  const handleLike = async () => {
    try {
      await API.post(`/posts/${post._id}/like`);
      onUpdate(); 
    } catch (err) {
      console.error("Like failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${post._id}`);
        onUpdate(); 
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-2xl transition-shadow duration-300">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link
            to={`/profile/${post.author._id}`}
            className="text-2xl font-bold text-purple-600 hover:underline"
          >
            {post.author.username}
          </Link>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Post*/}
      <p className="text-gray-800 text-lg leading-relaxed mb-8">{post.content}</p>

      {/* Likes and Comments Counting */}
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center space-x-8">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition"
          >
            <span className="font-semibold text-lg">{post.likes.length} Likes</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-semibold text-lg">{post.comments.length} Comments</span>
          </div>
        </div>

        {/* Delete Post the post */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;