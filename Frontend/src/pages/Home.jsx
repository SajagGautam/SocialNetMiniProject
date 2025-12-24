import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import API from "../services/API";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log("Error loading posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Social Feed</h1>
        <SearchBar />
        {user && <PostForm onPostCreated={fetchPosts} />}
        {loading && (
          <p className="text-center text-2xl text-gray-600 mt-20">
            Loading posts...
          </p>
        )}
        {!loading && posts.length === 0 && (
          <p className="text-center text-2xl text-gray-600 mt-20">
            No posts yet. {user ? "Create one!" : "Login to see posts."}
          </p>
        )}
        {!loading && posts.length > 0 && (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;