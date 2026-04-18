const Blog = require("../models/Blog");

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc    Fetch single blog
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ message: "Blog post not found" });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await Blog.deleteOne({ _id: blog._id });
    res.json({ message: "Blog removed" });
  } else {
    res.status(404).json({ message: "Blog not found" });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  const { title, slug, image, content, author, date, tags, isFeatured } = req.body;

  const blog = new Blog({
    title,
    slug,
    image,
    content,
    author,
    date,
    tags,
    isFeatured,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  const { title, slug, image, content, author, date, tags, isFeatured } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.image = image || blog.image;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    blog.date = date || blog.date;
    blog.tags = tags || blog.tags;
    blog.isFeatured = isFeatured !== undefined ? isFeatured : blog.isFeatured;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404).json({ message: "Blog not found" });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  deleteBlog,
  createBlog,
  updateBlog,
};
