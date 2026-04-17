import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

const BlogForm = ({ createBlog, onCancel }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2.5}>
        <TextField
          label="Title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          fullWidth
          color="primary"
        />
        <TextField
          label="Author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          fullWidth
          color="primary"
        />
        <TextField
          label="Url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          fullWidth
          color="primary"
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            create
          </Button>
          <Button type="button" variant="outlined" color="error" onClick={onCancel}>
            cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

export default BlogForm
