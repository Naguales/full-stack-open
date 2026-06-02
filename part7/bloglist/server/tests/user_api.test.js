const {
  test, describe, beforeEach, after,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
      blogs: [],
    });

    const savedUser = await user.save();
    const blog = new Blog({
      title: 'Refactoring',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/books/refactoring.html',
      likes: 42,
      user: savedUser.id,
    });
    const savedBlog = await blog.save();

    savedUser.blogs = [savedBlog.id];
    await savedUser.save();
  });

  test('creates a valid user successfully', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, 2);
    assert.ok(usersAtEnd.some((user) => user.username === newUser.username));
  });

  test('returns users with username, name, id, and created blogs', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.ok(response.body.every((user) => user.username));
    assert.ok(response.body.every((user) => Object.hasOwn(user, 'name')));
    assert.ok(response.body.every((user) => user.id));
    assert.ok(
      response.body.every((user) => !Object.hasOwn(user, 'passwordHash')),
    );
    assert.ok(response.body.every((user) => Array.isArray(user.blogs)));
    assert.ok(
      response.body[0].blogs.some((blog) => blog.title === 'Refactoring'),
    );
  });

  test('returns 400 and an error message if username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate Root',
      password: 'salainen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.match(response.body.error, /username must be unique/i);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });

  test('returns 400 if username is missing', async () => {
    const newUser = {
      name: 'Missing Username',
      password: 'salainen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.match(response.body.error, /username.*required/i);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });

  test('returns 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Too Short Username',
      password: 'salainen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.match(
      response.body.error,
      /shorter than the minimum allowed length/i,
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });

  test('returns 400 if password is missing', async () => {
    const newUser = {
      username: 'passwordless',
      name: 'No Password',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.match(response.body.error, /password is required/i);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });

  test('returns 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'shortpass',
      name: 'Short Password',
      password: 'ab',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.match(
      response.body.error,
      /password must be at least 3 characters long/i,
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
