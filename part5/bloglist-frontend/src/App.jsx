import { useState, useEffect } from 'react'
import { Link as RouterLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { AppBar, Box, Button, Chip, Container, Divider, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material'
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
      <Paper sx={{ maxWidth: 440, p: 4, mt: 4, borderRadius: 4, border: 1, borderColor: 'divider' }}>
        <Typography component="h2" variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
          Log in to application
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              fullWidth
              color="primary"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              fullWidth
              color="primary"
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
              login
            </Button>
          </Stack>
        </form>
      </Paper>
    )
  }

  const blogList = () => (
    <Box>
      <Typography component="h2" variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
        Blogs
      </Typography>
      {blogs.map(blog =>
        <Box key={blog.id} sx={{ mb: 1.5 }}>
          <Button
            component={RouterLink}
            to={`/blogs/${blog.id}`}
            variant="text"
            color="primary"
            sx={{ p: 0, textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
          >
            {blog.title} by {blog.author}
          </Button>
        </Box>
      )}
    </Box>
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
      <Paper
        sx={{
          maxWidth: 760,
          mt: 2,
          overflow: 'hidden',
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 4,
            bgcolor: 'primary.main',
            color: 'common.white',
          }}
        >
          <Typography component="h2" variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15, color: 'common.white' }}>
            {blog.title}
          </Typography>
          <Typography sx={{ mt: 1, color: 'common.white', opacity: 0.92, fontSize: '1.05rem', fontWeight: 500 }}>
            by {blog.author}
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ p: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
              Source
            </Typography>
            <Typography
              component="a"
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              sx={{
                display: 'block',
                mt: 0.5,
                color: 'primary.main',
                textDecoration: 'none',
                wordBreak: 'break-word',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {blog.url}
            </Typography>
          </Box>

          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Chip
              label={`Likes ${blog.likes}`}
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 700,
                borderRadius: 1,
                bgcolor: 'rgba(0, 98, 255, 0.06)',
                height: 36,
                '& .MuiChip-label': {
                  px: 1.75,
                },
              }}
            />
            {user !== null && (
              <Button type="button" variant="contained" onClick={() => handleLike(blog)} sx={{ borderRadius: 1, minHeight: 36 }}>
                like
              </Button>
            )}
          </Stack>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
              Added by
            </Typography>
            <Typography sx={{ mt: 0.5, fontWeight: 500 }}>
              {blog.user?.name}
            </Typography>
          </Box>
        </Stack>

        {canDelete && (
          <Box sx={{ px: 4, pb: 4 }}>
            <Button type="button" variant="outlined" color="error" onClick={() => handleDelete(blog)}>
              remove
            </Button>
          </Box>
        )}
      </Paper>
    )
  }

  const blogCreationView = () => {
    if (user === null) {
      return <Navigate replace to="/login" />
    }

    return (
      <Paper sx={{ maxWidth: 560, p: 4, mt: 4, borderRadius: 4, border: 1, borderColor: 'divider' }}>
        <Typography component="h2" variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
          create new
        </Typography>
        <BlogForm createBlog={addBlog} onCancel={() => navigate('/')} />
      </Paper>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.dark', color: 'common.white' }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Button component={RouterLink} to="/" color="inherit" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
            Blogs
          </Button>
          {user === null && (
            <Button component={RouterLink} to="/login" color="inherit" sx={{ textTransform: 'uppercase' }}>
              Login
            </Button>
          )}
          {user !== null && (
            <Button component={RouterLink} to="/blogs/new" color="inherit" sx={{ textTransform: 'uppercase' }}>
              Create New
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user !== null && (
            <Button type="button" variant="outlined" color="inherit" onClick={handleLogout} sx={{ textTransform: 'uppercase' }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Notification notification={notification} />

        <Routes>
          <Route path="/" element={blogList()} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/blogs/new" element={blogCreationView()} />
          <Route path="/login" element={loginForm()} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
