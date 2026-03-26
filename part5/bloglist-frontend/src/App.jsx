import { useState, useEffect } from 'react'
import './index.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isBlogFormVisible, setIsBlogFormVisible] = useState(false)

  const sortBlogsByLikes = (blogs) => [...blogs].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user === null) {
      setBlogs([])
      return
    }

    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(sortBlogsByLikes(blogs))
    }

    fetchBlogs()
  }, [user])

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome back, ${user.name}`, 'success')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setBlogs([])
    setIsBlogFormVisible(false)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      const blogWithUser = {
        ...blog,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      }

      setBlogs(sortBlogsByLikes(blogs.concat(blogWithUser)))
      setIsBlogFormVisible(false)
      showNotification(`a new blog ${blog.title} by ${blog.author} added`, 'success')
    } catch {
      showNotification('failed to add blog', 'error')
      throw new Error('Blog creation failed')
    }
  }

  const handleLike = async (blog) => {
    try {
      if (!blog.user) {
        showNotification('blog has no owner', 'error')
        return
      }

      const userId = blog.user.id || blog.user._id || blog.user
      const updatedBlog = await blogService.update(blog.id, {
        user: userId,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      })

      setBlogs(sortBlogsByLikes(blogs.map(currentBlog =>
        currentBlog.id === blog.id
          ? { ...updatedBlog, user: blog.user }
          : currentBlog
      )))
    } catch (error) {
      const message = error.response?.data?.error || `failed to update likes for ${blog.title}`
      showNotification(message, 'error')
    }
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(currentBlog => currentBlog.id !== blog.id))
      showNotification(`removed blog ${blog.title} by ${blog.author}`, 'success')
    } catch (error) {
      const message = error.response?.data?.error || `failed to remove blog ${blog.title}`
      showNotification(message, 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      {isBlogFormVisible
        ? (
          <div>
            <h2>create new</h2>
            <BlogForm createBlog={addBlog} onCancel={() => setIsBlogFormVisible(false)} />
          </div>
        )
        : (
          <button type="button" onClick={() => setIsBlogFormVisible(true)}>
            create new blog
          </button>
        )}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          currentUser={user}
        />
      )}
    </div>
  )
}

export default App
