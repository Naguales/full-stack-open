import { useAnecdoteActions, useAnecdotes, useFilter } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { removeAnecdote, voteAnecdote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()
  const filteredAndSortedAnecdotes = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    await voteAnecdote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  const handleDelete = async (anecdote) => {
    await removeAnecdote(anecdote.id)
    showNotification(`you deleted '${anecdote.content}'`)
  }

  return filteredAndSortedAnecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
        {anecdote.votes === 0 && (
          <button onClick={() => handleDelete(anecdote)}>delete</button>
        )}
      </div>
    </div>
  ))
}

export default AnecdoteList
