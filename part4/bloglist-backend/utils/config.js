require('dotenv').config();

const PORT = process.env.PORT || 3003;

const getTestMongoUri = () => {
  if (process.env.TEST_MONGODB_URI) {
    return process.env.TEST_MONGODB_URI;
  }

  if (!process.env.MONGODB_URI) {
    return 'mongodb://localhost/bloglist-test';
  }

  return process.env.MONGODB_URI.replace(/\/([^/?]+)(\?.*)?$/, '/$1-test$2');
};

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? getTestMongoUri()
  : process.env.MONGODB_URI || 'mongodb://localhost/bloglist';

module.exports = { MONGODB_URI, PORT };
