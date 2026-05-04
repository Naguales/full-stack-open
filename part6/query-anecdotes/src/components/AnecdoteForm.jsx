import { useNotify } from '../NotificationContext'
import { useCreateAnecdote } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const notify = useNotify()
  const newAnecdoteMutation = useCreateAnecdote({
    onSuccess: (newAnecdote) => {
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      notify(error.message)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate(content)
    event.target.reset()
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
