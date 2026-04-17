import { useState, useEffect } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './index.css'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
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
      showNotification(`a new blog ${blog.title} by ${blog.author} added`, 'success')
      navigate('/')
    } catch {
      showNotification('failed to add blog', 'error')
      throw new Error('Blog creation failed')
    }
  }

  const handleLike = async (blog) => {
    try {
      if (user === null) {
        showNotification('you must be logged in to like a blog', 'error')
        return
      }

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
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || `failed to remove blog ${blog.title}`
      showNotification(message, 'error')
    }
  }

  const loginForm = () => {
    if (user !== null) {
      return <Navigate replace to="/" />
    }

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

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      )}
    </div>
  )

  const BlogView = () => {
    const { id } = useParams()
    const blog = blogs.find(blog => blog.id === id)

    if (!blog) {
      return <div>blog not found</div>
    }

    const blogUserId = blog.user?.id || blog.user?._id || blog.user
    const currentUserId = user?.id || user?._id
    const canDelete = blogUserId === currentUserId

    return (
      <div>
        <h2>{blog.title} by {blog.author}</h2>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          {user !== null && (
            <button type="button" onClick={() => handleLike(blog)}>like</button>
          )}
        </div>
        <div>{blog.user?.name}</div>
        {canDelete && (
          <button type="button" onClick={() => handleDelete(blog)}>remove</button>
        )}
      </div>
    )
  }

  const blogCreationView = () => {
    if (user === null) {
      return <Navigate replace to="/login" />
    }

    return (
      <div>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} onCancel={() => navigate('/')} />
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <nav>
        <Link to="/">blogs</Link>
        {' '}
        {user === null && (
          <>
            <Link to="/login">login</Link>
            {' '}
          </>
        )}
        {user !== null && (
          <>
            <Link to="/blogs/new">create new</Link>
            {' '}
          </>
        )}
        {user !== null && (
          <button type="button" onClick={handleLogout}>logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={blogList()} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/blogs/new" element={blogCreationView()} />
        <Route path="/login" element={loginForm()} />
      </Routes>
    </div>
  )
}

export default App
