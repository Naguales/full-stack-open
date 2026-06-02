const _ = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((favorite, blog) => (blog.likes > favorite.likes ? blog : favorite));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const result = _.maxBy(
    _.toPairs(_.countBy(blogs, 'author')),
    ([, blogCount]) => blogCount,
  );

  return { author: result[0], blogs: result[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return _(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, 'likes'),
    }))
    .maxBy('likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
