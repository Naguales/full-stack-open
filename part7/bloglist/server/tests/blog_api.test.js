const {
  test, describe, beforeEach, after,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is a starter batch of blogs in storage', () => {
  const loginAndGetToken = async (username, password) => {
    const response = await api.post('/api/login').send({ username, password });

    return response.body.token;
  };

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username: 'blogtester',
      name: 'Blog Tester',
      passwordHash,
      blogs: [],
    });

    const savedUser = await user.save();

    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: savedUser.id,
    }));

    const savedBlogs = await Blog.insertMany(blogsWithUser);

    savedUser.blogs = savedBlogs.map((blog) => blog.id);
    await savedUser.save();
  });

  test('returns blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns all seeded blogs', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('returns blogs with id instead of _id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    assert.ok(blogsAtStart.every((blog) => blog.id));
    assert.ok(blogsAtStart.every((blog) => !Object.hasOwn(blog, '_id')));
  });

  test('includes creator details for each blog', async () => {
    const response = await api.get('/api/blogs');

    assert.ok(response.body.every((blog) => blog.user));
    assert.ok(
      response.body.every((blog) => blog.user.username === 'blogtester'),
    );
    assert.ok(response.body.every((blog) => blog.user.name === 'Blog Tester'));
  });

  describe('creation of a blog entry', () => {
    test('creates a blog with valid data and a valid token', async () => {
      const newBlog = {
        title: 'Microservices',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/microservices.html',
        likes: 11,
      };
      const token = await loginAndGetToken('blogtester', 'sekret');

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
      assert.ok(blogsAtEnd.some((blog) => blog.title === newBlog.title));
      assert.ok(blogsAtEnd.some((blog) => blog.url === newBlog.url));
      assert.ok(blogsAtEnd.every((blog) => blog.user));
    });

    test('defaults likes to 0 when likes is omitted', async () => {
      const newBlog = {
        title: 'Microservices',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/serverless.html',
      };
      const token = await loginAndGetToken('blogtester', 'sekret');

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test('returns 400 when title is missing', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/eaaDev/uiArchs.html',
        likes: 1,
      };
      const token = await loginAndGetToken('blogtester', 'sekret');

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test('returns 400 when url is missing', async () => {
      const newBlog = {
        title: 'Missing url',
        author: 'Martin Fowler',
        likes: 1,
      };
      const token = await loginAndGetToken('blogtester', 'sekret');

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test('returns 401 when token is missing', async () => {
      const newBlog = {
        title: 'Unauthenticated blog',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/agileFluency.html',
        likes: 1,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });

    test('assigns the authenticated user as the blog creator', async () => {
      const newBlog = {
        title: 'Patterns of Enterprise Application Architecture',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/books/eaa.html',
        likes: 15,
      };
      const token = await loginAndGetToken('blogtester', 'sekret');

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      assert.strictEqual(response.body.user.username, 'blogtester');
      assert.strictEqual(response.body.user.name, 'Blog Tester');
    });
  });

  describe('deletion of a blog entry', () => {
    test('returns 204 when the creator deletes the blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];
      const token = await loginAndGetToken('blogtester', 'sekret');

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
      assert.ok(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id));
    });

    test('returns 401 when token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
    });

    test('returns 403 when the token belongs to a different user', async () => {
      const passwordHash = await bcrypt.hash('another-secret', 10);
      const anotherUser = new User({
        username: 'anotheruser',
        name: 'Another User',
        passwordHash,
        blogs: [],
      });
      await anotherUser.save();

      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];
      const token = await loginAndGetToken('anotheruser', 'another-secret');

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      assert.ok(blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
    });
  });

  describe('updating a stored blog entry', () => {
    test('updates the likes of an existing blog', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 10,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, updatedBlog.likes);

      const blogsAtEnd = await helper.blogsInDb();
      const savedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

      assert.strictEqual(savedBlog.likes, updatedBlog.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
