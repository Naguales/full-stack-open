import { useAnecdoteActions, useAnecdotes } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { voteAnecdote } = useAnecdoteActions()
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return sortedAnecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
      </div>
    </div>
  ))
}

export default AnecdoteList
