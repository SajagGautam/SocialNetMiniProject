import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/API";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setProfileUser(res.data.user);
        setPosts(res.data.posts);
        setBio(res.data.user.bio || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdateBio = async () => {
    try {
      await API.put(`/users/${id}`, { bio });
      setProfileUser({ ...profileUser, bio });
      setIsEditingBio(false);
    } catch (err) {
      alert("Failed to update bio");
    }
  };

  const refreshPosts = async () => {
    const res = await API.get(`/users/${id}`);
    setPosts(res.data.posts);
  };

  if (!profileUser) return <div className="text-center py-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-10">
          <div className="bg-gray-300 rounded-full w-32 h-32 mr-8 flex items-center justify-center text-4xl font-bold text-white">
            {profileUser.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800">{profileUser.username}</h1>
            <p className="text-gray-600 mt-2 text-lg">
              {profileUser.followers.length} Followers · {profileUser.following.length} Following
            </p>

            {isOwnProfile ? (
              <div className="mt-4">
                {isEditingBio ? (
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Update your bio..."
                    />
                    <button
                      onClick={handleUpdateBio}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 italic">{bio || "No bio yet. Click to add one."}</p>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Edit Bio
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-700 mt-4 italic">{bio || "No bio"}</p>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-gray-800">Posts</h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-xl">No posts yet</p>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={refreshPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;