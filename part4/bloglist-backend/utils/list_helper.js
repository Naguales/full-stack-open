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

  const blogsByAuthor = blogs.reduce((acc, blog) => {
    const count = acc.get(blog.author) || 0;
    acc.set(blog.author, count + 1);
    return acc;
  }, new Map());

  return Array.from(blogsByAuthor.entries()).reduce((topBlogger, [author, count]) => (
    count > topBlogger.blogs ? { author, blogs: count } : topBlogger
  ), { author: null, blogs: 0 });
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    const likes = acc.get(blog.author) || 0;
    acc.set(blog.author, likes + (blog.likes || 0));
    return acc;
  }, new Map());

  return Array.from(likesByAuthor.entries()).reduce((favoriteAuthor, [author, likes]) => (
    likes > favoriteAuthor.likes ? { author, likes } : favoriteAuthor
  ), { author: null, likes: 0 });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
