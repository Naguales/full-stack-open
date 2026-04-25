import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    await createAnecdote(content)
    showNotification(`you created '${content}'`)
    event.target.anecdote.value = ''
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
