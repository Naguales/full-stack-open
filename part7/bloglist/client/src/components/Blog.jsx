import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [isVisible, setIsVisible] = useState(false)
  const blogUserId = blog.user?.id || blog.user?._id || blog.user
  const currentUserId = currentUser?.id || currentUser?._id
  const canDelete = blogUserId === currentUserId
  const canLike = currentUser !== null

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} by {blog.author}
        <button type="button" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'hide' : 'view'}
        </button>
      </div>
      {isVisible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            {canLike && (
              <button type="button" onClick={() => handleLike(blog)}>
                like
              </button>
            )}
          </div>
          <div>{blog.user?.name}</div>
          {canDelete && (
            <button type="button" onClick={() => handleDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
