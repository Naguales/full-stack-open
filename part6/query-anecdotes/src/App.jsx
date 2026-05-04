import { useNotify } from './NotificationContext'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes, useVoteAnecdote } from './hooks/useAnecdotes'

const App = () => {
  const notify = useNotify()
  const result = useAnecdotes()
  const voteAnecdoteMutation = useVoteAnecdote((updatedAnecdote) => {
    notify(`anecdote '${updatedAnecdote.content}' voted`)
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
