import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new category
router.post("/", async (req, res) => {
  try {
    const newCat = new Category(req.body);
    const savedCat = await newCat.save();
    res.json(savedCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
