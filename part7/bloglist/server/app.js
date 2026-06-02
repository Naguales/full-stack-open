const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const usersRouter = require('./controllers/users');

const app = express();
const distPath = path.join(__dirname, '../client/dist');
const indexPath = path.join(distPath, 'index.html');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (request, response, next) => {
    if (!fs.existsSync(indexPath)) {
      return next();
    }

    return response.sendFile(indexPath);
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
