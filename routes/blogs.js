const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
let marked;

// import markdown renderer
import("marked").then(m => {
  marked = m.marked;
});

// Route 1: show all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.render("blogs", { blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).render("404", { message: "Failed to load blogs." });
  }
});

// Route 2: single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).render("404", { message: "Blog not found" });
    }

    if (!marked) {
      return res.status(500).send("Markdown parser not ready yet");
    }

    res.render("dynamic-blog", { blog, marked, request: req });
  } catch (err) {
    console.error("Error fetching single blog:", err);
    res.status(500).render("404", { message: "Error fetching blog" });
  }
});

module.exports = router;