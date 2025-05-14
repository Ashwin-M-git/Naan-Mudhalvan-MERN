const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user.id });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBlogs = async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        await blog.deleteOne();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
