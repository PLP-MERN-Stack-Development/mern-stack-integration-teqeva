import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
};

export const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
};
