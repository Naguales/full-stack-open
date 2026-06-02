const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    return response.json(blogs);
  } catch (error) {
    return next(error);
  }
});

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const { user } = request;

    const blog = new Blog({
      ...request.body,
      likes: request.body.likes ?? 0,
      /* eslint-disable no-underscore-dangle */
      user: user._id,
      /* eslint-enable no-underscore-dangle */
    });

    const result = await blog.save();
    /* eslint-disable no-underscore-dangle */
    user.blogs = user.blogs.concat(result._id);
    /* eslint-enable no-underscore-dangle */
    await user.save();

    /* eslint-disable no-underscore-dangle */
    const populatedBlog = await Blog.findById(result._id).populate('user', {
      username: 1,
      name: 1,
    });
    /* eslint-enable no-underscore-dangle */

    return response.status(201).json(populatedBlog);
  } catch (error) {
    return next(error);
  }
});

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const { user } = request;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    if (!blog.user || blog.user.toString() !== user.id.toString()) {
      return response
        .status(403)
        .json({ error: 'only the creator can delete a blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);

    if (blog?.user) {
      const creator = await User.findById(blog.user);

      if (creator) {
        creator.blogs = creator.blogs.filter(
          (blogId) => blogId.toString() !== request.params.id,
        );
        await creator.save();
      }
    }

    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    if (!blog.user) {
      return response.status(400).json({ error: 'blog has no owner' });
    }

    blog.title = request.body.title;
    blog.author = request.body.author;
    blog.url = request.body.url;
    blog.likes = request.body.likes;

    const updatedBlog = await blog.save();
    await updatedBlog.populate('user', { username: 1, name: 1 });

    return response.json(updatedBlog);
  } catch (error) {
    return next(error);
  }
});

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const { comment } = request.body;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    if (!comment) {
      return response.status(400).json({ error: 'comment is required' });
    }

    blog.comments = blog.comments.concat(comment);

    const updatedBlog = await blog.save();
    await updatedBlog.populate('user', { username: 1, name: 1 });

    return response.status(201).json(updatedBlog);
  } catch (error) {
    return next(error);
  }
});

module.exports = blogsRouter;
