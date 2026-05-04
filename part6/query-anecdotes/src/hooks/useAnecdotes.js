import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const anecdotesUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await fetch(anecdotesUrl)

  if (!response.ok) {
    throw new Error('anecdote service not available due to problems in server')
  }

  return response.json()
}

const createAnecdote = async (content) => {
  const response = await fetch(anecdotesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      votes: 0,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error ?? 'failed to create anecdote')
  }

  return response.json()
}

const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${anecdotesUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote),
  })

  if (!response.ok) {
    throw new Error('failed to update anecdote')
  }

  return response.json()
}

export const useAnecdotes = () =>
  useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
  })

export const useCreateAnecdote = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) ?? []
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      onSuccess?.(newAnecdote)
    },
    onError: (error) => {
      onError?.(error)
    },
  })
}

export const useVoteAnecdote = (onSuccess) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) ?? []
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      )
      onSuccess?.(updatedAnecdote)
    },
  })
}
