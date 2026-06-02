import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom'
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import './index.css'
import BlogForm from './components/BlogForm'
import ErrorBoundary from './components/ErrorBoundary'
import Notification from './components/Notification'
import useField from './hooks/useField'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser'
import userService from './services/users'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useUserStore((state) => state.user)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const setSignedInUser = useUserStore((state) => state.setSignedInUser)
  const setNotification = useNotificationStore((state) => state.setNotification)
  const clearNotification = useNotificationStore(
    (state) => state.clearNotification
  )
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')
  const { reset: resetComment, ...comment } = useField('text')

  const sortBlogsByLikes = (blogs) =>
    [...blogs].sort((a, b) => b.likes - a.likes)

  const getCommentInitials = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean)

    if (words.length === 0) {
      return 'C'
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase()
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  const blogQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (blog) => {
      const blogWithUser = user
        ? {
          ...blog,
          user: {
            id: user.id,
            username: user.username,
            name: user.name
          }
        }
        : blog

      queryClient.setQueryData(['blogs'], (previousBlogs = []) =>
        sortBlogsByLikes(previousBlogs.concat(blogWithUser))
      )

      showNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        'success'
      )
      navigate('/')
    },
    onError: () => {
      showNotification('failed to add blog', 'error')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (updatedBlog, variables) => {
      queryClient.setQueryData(['blogs'], (previousBlogs = []) =>
        sortBlogsByLikes(
          previousBlogs.map((currentBlog) =>
            currentBlog.id === variables.id
              ? {
                ...updatedBlog,
                user:
                    updatedBlog.user && typeof updatedBlog.user === 'object'
                      ? updatedBlog.user
                      : variables.user
              }
              : currentBlog
          )
        )
      )
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['blogs'], (previousBlogs = []) =>
        previousBlogs.filter((currentBlog) => currentBlog.id !== deletedId)
      )
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (previousBlogs = []) =>
        sortBlogsByLikes(
          previousBlogs.map((currentBlog) =>
            currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
          )
        )
      )
      resetComment()
    }
  })

  const blogs = sortBlogsByLikes(blogQuery.data ?? [])

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })

    setTimeout(() => {
      clearNotification()
    }, 5000)
  }

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      persistentUser.saveUser(user)
      setSignedInUser(user)
      resetUsername()
      resetPassword()
      showNotification(`Welcome back, ${user.name}`, 'success')
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    persistentUser.removeUser()
    setSignedInUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      await createBlogMutation.mutateAsync(blogObject)
    } catch {
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
      await updateBlogMutation.mutateAsync({
        id: blog.id,
        user: blog.user,
        blog: {
          user: userId,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url
        }
      })
    } catch (error) {
      const message =
        error.response?.data?.error ||
        `failed to update likes for ${blog.title}`
      showNotification(message, 'error')
    }
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteBlogMutation.mutateAsync(blog.id)
      showNotification(
        `removed blog ${blog.title} by ${blog.author}`,
        'success'
      )
      navigate('/')
    } catch (error) {
      const message =
        error.response?.data?.error || `failed to remove blog ${blog.title}`
      showNotification(message, 'error')
    }
  }

  const handleAddComment = async (event, blog) => {
    event.preventDefault()

    try {
      await addCommentMutation.mutateAsync({
        id: blog.id,
        comment: comment.value
      })
    } catch (error) {
      const message =
        error.response?.data?.error || `failed to add comment to ${blog.title}`
      showNotification(message, 'error')
    }
  }

  const loginForm = () => {
    if (user !== null) {
      return <Navigate replace to="/" />
    }

    return (
      <Paper
        sx={{
          maxWidth: 440,
          p: 4,
          mt: 4,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}
        >
          Log in to application
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              name="Username"
              {...username}
              fullWidth
              color="primary"
            />
            <TextField
              label="Password"
              name="Password"
              {...password}
              fullWidth
              color="primary"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ alignSelf: 'flex-start' }}
            >
              login
            </Button>
          </Stack>
        </form>
      </Paper>
    )
  }

  const blogList = () => (
    <Box>
      <Typography
        component="h2"
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
      >
        Blogs
      </Typography>
      {blogQuery.isLoading && (
        <Typography sx={{ color: 'text.secondary' }}>
          Loading blogs...
        </Typography>
      )}
      {blogQuery.isError && (
        <Typography sx={{ color: 'error.main' }}>
          Failed to load blogs.
        </Typography>
      )}
      {blogs.map((blog) => (
        <Box key={blog.id} sx={{ mb: 1.5 }}>
          <Button
            component={RouterLink}
            to={`/blogs/${blog.id}`}
            variant="text"
            color="primary"
            sx={{
              p: 0,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            {blog.title} by {blog.author}
          </Button>
        </Box>
      ))}
    </Box>
  )

  const BlogView = () => {
    const { id } = useParams()
    const blog = blogs.find((blog) => blog.id === id)

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
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 4,
            bgcolor: 'primary.main',
            color: 'common.white'
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            sx={{ fontWeight: 800, lineHeight: 1.15, color: 'common.white' }}
          >
            {blog.title}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: 'common.white',
              opacity: 0.92,
              fontSize: '1.05rem',
              fontWeight: 500
            }}
          >
            by {blog.author}
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ p: 4 }}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: 1.2 }}
            >
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
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {blog.url}
            </Typography>
          </Box>

          <Divider />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
          >
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
                  px: 1.75
                }
              }}
            />
            {user !== null && (
              <Button
                type="button"
                variant="contained"
                onClick={() => handleLike(blog)}
                sx={{ borderRadius: 1, minHeight: 36 }}
              >
                like
              </Button>
            )}
          </Stack>

          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: 1.2 }}
            >
              Added by
            </Typography>
            <Typography sx={{ mt: 0.5, fontWeight: 500 }}>
              {blog.user?.name}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography
              component="h3"
              variant="h5"
              sx={{ mb: 2, fontWeight: 800, color: 'text.primary' }}
            >
              comments
            </Typography>
            <Box
              component="form"
              onSubmit={(event) => handleAddComment(event, blog)}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'stretch',
                mb: 2.5
              }}
            >
              <TextField
                label="add a comment"
                size="small"
                {...comment}
                sx={{ flex: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ px: 2.5, whiteSpace: 'nowrap' }}
              >
                add comment
              </Button>
            </Box>
            {(blog.comments ?? []).length > 0 ? (
              <List
                disablePadding
                sx={{
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  overflow: 'hidden'
                }}
              >
                {blog.comments.map((listedComment, index) => (
                  <ListItem
                    key={`${blog.id}-comment-${index}`}
                    divider={index !== blog.comments.length - 1}
                    sx={{ alignItems: 'center', py: 1.5 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      {getCommentInitials(listedComment)}
                    </Avatar>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: 32
                      }}
                    >
                      {listedComment}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  px: 2,
                  py: 2,
                  borderRadius: 3,
                  bgcolor: 'background.default',
                  color: 'text.secondary'
                }}
              >
                No comments yet.
              </Paper>
            )}
          </Box>
        </Stack>

        {canDelete && (
          <Box sx={{ px: 4, pb: 4 }}>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(blog)}
            >
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
      <Paper
        sx={{
          maxWidth: 560,
          p: 4,
          mt: 4,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}
        >
          create new
        </Typography>
        <BlogForm createBlog={addBlog} onCancel={() => navigate('/')} />
      </Paper>
    )
  }

  const notFoundView = () => (
    <Paper
      sx={{
        maxWidth: 560,
        p: 4,
        mt: 4,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Typography
        component="h2"
        variant="h5"
        sx={{ mb: 1, color: 'text.primary', fontWeight: 700 }}
      >
        Page not found
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        The page you requested does not exist.
      </Typography>
    </Paper>
  )

  const UserView = () => {
    const { id } = useParams()
    const listedUser = userQuery.data?.find(
      (currentUser) => currentUser.id === id
    )

    if (userQuery.isLoading) {
      return (
        <Typography sx={{ color: 'text.secondary' }}>
          Loading user...
        </Typography>
      )
    }

    if (userQuery.isError) {
      return (
        <Typography sx={{ color: 'error.main' }}>
          Failed to load user.
        </Typography>
      )
    }

    if (!listedUser) {
      return (
        <Typography sx={{ color: 'text.secondary' }}>user not found</Typography>
      )
    }

    return (
      <Box>
        <Typography
          component="h2"
          variant="h4"
          sx={{ mb: 1.5, fontWeight: 800, color: 'text.primary' }}
        >
          {listedUser.name}
        </Typography>
        <Typography sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
          @{listedUser.username}
        </Typography>

        <Paper
          sx={{
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: 'background.default',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography
              component="h3"
              variant="h6"
              sx={{ fontWeight: 800, color: 'text.primary' }}
            >
              added blogs
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {listedUser.blogs.length} total
            </Typography>
          </Box>

          {listedUser.blogs.length > 0 ? (
            <List disablePadding>
              {listedUser.blogs.map((blog, index) => (
                <ListItem
                  key={blog.id}
                  divider={index !== listedUser.blogs.length - 1}
                  sx={{ py: 1.75 }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {blog.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {blog.author}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ px: 3, py: 2.5, color: 'text.secondary' }}>
              This user has not added any blogs yet.
            </Box>
          )}
        </Paper>
      </Box>
    )
  }

  const usersView = () => (
    <Box>
      <Typography
        component="h2"
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
      >
        Users
      </Typography>

      {userQuery.isLoading && (
        <Typography sx={{ color: 'text.secondary' }}>
          Loading users...
        </Typography>
      )}

      {userQuery.isError && (
        <Typography sx={{ color: 'error.main' }}>
          Failed to load users.
        </Typography>
      )}

      {userQuery.data && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Blogs created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userQuery.data.map((listedUser) => (
                <TableRow key={listedUser.id}>
                  <TableCell>
                    <Box
                      component={RouterLink}
                      to={`/users/${listedUser.id}`}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1.5,
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '0.95rem',
                          fontWeight: 800
                        }}
                      >
                        {listedUser.name?.charAt(0) || '?'}
                      </Avatar>
                      <Typography
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          textDecoration: 'underline'
                        }}
                      >
                        {listedUser.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {listedUser.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={listedUser.blogs.length}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, minWidth: 52 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'primary.dark',
          color: 'common.white'
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ textTransform: 'uppercase', fontWeight: 700 }}
          >
            Blogs
          </Button>
          {user === null && (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              sx={{ textTransform: 'uppercase' }}
            >
              Login
            </Button>
          )}
          <Button
            component={RouterLink}
            to="/users"
            color="inherit"
            sx={{ textTransform: 'uppercase' }}
          >
            Users
          </Button>
          {user !== null && (
            <Button
              component={RouterLink}
              to="/blogs/new"
              color="inherit"
              sx={{ textTransform: 'uppercase' }}
            >
              Create New
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user !== null && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{ textTransform: 'uppercase' }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <ErrorBoundary key={location.pathname}>
          <Notification />

          <Routes>
            <Route path="/" element={blogList()} />
            <Route path="/users" element={usersView()} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="/blogs/new" element={blogCreationView()} />
            <Route path="/login" element={loginForm()} />
            <Route path="*" element={notFoundView()} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </Box>
  )
}

export default App
