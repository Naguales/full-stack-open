import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    createAnecdote: async (content) => {
      const newAnecdote = {
        content,
        votes: 0,
      }

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnecdote),
      })
      const createdAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.concat(createdAnecdote),
      }))
    },
    initializeAnecdotes: async () => {
      const response = await fetch(baseUrl)
      const anecdotes = await response.json()

      set(() => ({
        anecdotes,
      }))
    },
    removeAnecdote: async (id) => {
      await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      })

      set((state) => ({
        anecdotes: state.anecdotes.filter((anecdote) => anecdote.id !== id),
      }))
    },
    setFilter: (filter) =>
      set(() => ({
        filter,
      })),
    voteAnecdote: async (id) => {
      const anecdoteToVoteFor = useAnecdoteStore
        .getState()
        .anecdotes.find((anecdote) => anecdote.id === id)

      if (!anecdoteToVoteFor) {
        return
      }

      const updatedAnecdote = {
        ...anecdoteToVoteFor,
        votes: anecdoteToVoteFor.votes + 1,
      }

      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnecdote),
      })
      const returnedAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id ? returnedAnecdote : anecdote
        ),
      }))
    },
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
