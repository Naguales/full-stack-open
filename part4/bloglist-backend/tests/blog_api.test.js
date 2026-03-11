const {
  test, describe, beforeEach, after,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is a starter batch of blogs in storage', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('the unique identifier property is named id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    assert.ok(blogsAtStart.every((blog) => blog.id));
    assert.ok(blogsAtStart.every((blog) => !Object.hasOwn(blog, '_id')));
  });

  describe('creation of a blog entry', () => {
    test('succeeds with valid payload', async () => {
      const newBlog = {
        title: 'Microservices',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/microservices.html',
        likes: 11,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
      assert.ok(blogsAtEnd.some((blog) => blog.title === newBlog.title));
      assert.ok(blogsAtEnd.some((blog) => blog.url === newBlog.url));
    });

    test('fills in zero likes when likes is omitted', async () => {
      const newBlog = {
        title: 'Microservices',
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/articles/serverless.html',
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/eaaDev/uiArchs.html',
        likes: 1,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'Missing url',
        author: 'Martin Fowler',
        likes: 1,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });
  });

  describe('deletion of a blog entry', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
      assert.ok(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id));
    });
  });

  describe('updating a stored blog entry', () => {
    test('succeeds when likes are changed', async () => {
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
