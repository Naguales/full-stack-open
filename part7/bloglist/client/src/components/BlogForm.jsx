import { Button, Stack, TextField } from '@mui/material'
import useField from '../hooks/useField'

const BlogForm = ({ createBlog, onCancel }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2.5}>
        <TextField
          label="Title"
          name="Title"
          {...title}
          fullWidth
          color="primary"
        />
        <TextField
          label="Author"
          name="Author"
          {...author}
          fullWidth
          color="primary"
        />
        <TextField label="Url" name="Url" {...url} fullWidth color="primary" />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            create
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

export default BlogForm
