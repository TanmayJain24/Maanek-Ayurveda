const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

let marked;
import('marked').then(m => {
  marked = m.marked;
});


// Read blogs.json once at startup (or refactor to read each time if blogs are frequently updated)
const blogsPath = path.join(__dirname, '../data/blogs.json');
let blogs = [];

// Function to load services
function loadBlogs() {
  try {
    const data = fs.readFileSync(blogsPath, 'utf-8');
    blogs = JSON.parse(data);
  } catch (err) {
    console.error('Failed to read blogs.json:', err.message);
    blogs = [];
  }
}

// Initial load
loadBlogs();

// Dynamic blog route
router.get('/:slug', (req, res) => {
  const blog = blogs.find(b => b.slug === req.params.slug);
  if (!blog) {
    return res.status(404).render('404', { message: 'Blog not found' });
  }

  if (!marked) {
    return res.status(500).send('Markdown parser not ready yet');
  }

  res.render('dynamic-blog', {
    blog,
    marked,
    request: req
  });
});

module.exports = router;