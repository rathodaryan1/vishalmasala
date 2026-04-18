const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  deleteBlog,
  createBlog,
  updateBlog,
} = require("../controllers/blogController");
const { protect, admin } = require("../middleware/auth");

router.route("/").get(getBlogs).post(protect, admin, createBlog);
router.route("/:slug").get(getBlogBySlug);
router.route("/:id").put(protect, admin, updateBlog).delete(protect, admin, deleteBlog);

module.exports = router;
