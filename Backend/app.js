require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongodbConnect = require("./database/db");
const User = require("./model/userModel");
const Post = require("./model/postModel");
const protect = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongodbConnect();

// Root route
app.get("/", (req, res) => {
  res.send("Social Networking API is running!");
});


// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// User Profile
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upadting the bio
app.put("/users/:id", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// SEARCH USERS
app.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ users: [] });

  try {
    const users = await User.find({
      username: { $regex: q, $options: "i" },
    }).select("username bio");

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE POST
app.post("/posts", protect, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Content required" });

  try {
    const post = await Post.create({
      content,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate("author", "username");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// See All Post
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("comments.author", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE POST
app.delete("/posts/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// LIKE / UNLIKE POST
app.post("/posts/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD COMMENT
app.post("/posts/:id/comment", protect, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Comment text required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, author: req.user._id });
    await post.save();

    await post.populate("comments.author", "username");
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});