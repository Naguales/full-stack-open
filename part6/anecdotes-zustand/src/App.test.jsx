import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('App', () => {
  test('initializes anecdotes from the backend', async () => {
    const anecdotesFromBackend = [
      {
        id: '1',
        content: '“It works on my machine” — the most feared sentence in software engineering.',
        votes: 3,
      },
      {
        id: '2',
        content: 'A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.',
        votes: 1,
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(anecdotesFromBackend),
      })
    )

    vi.resetModules()
    const { default: App } = await import('./App')

    render(<App />)

    expect(await screen.findByText('“It works on my machine” — the most feared sentence in software engineering.')).toBeTruthy()
    expect(await screen.findByText('A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.')).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/anecdotes')
  })

  test('voting increases the number of votes for an anecdote', async () => {
    const anecdoteFromBackend = {
      id: '1',
      content: '“It works on my machine” — the most feared sentence in software engineering.',
      votes: 0,
    }

    vi.stubGlobal(
      'fetch',
      vi.fn((url, options) => {
        if (url === 'http://localhost:3001/anecdotes' && !options) {
          return Promise.resolve({
            json: vi.fn().mockResolvedValue([anecdoteFromBackend]),
          })
        }

        if (url === 'http://localhost:3001/anecdotes/1') {
          return Promise.resolve({
            json: vi.fn().mockResolvedValue({
              ...anecdoteFromBackend,
              votes: 1,
            }),
          })
        }

        return Promise.reject(new Error(`Unexpected fetch call: ${url}`))
      })
    )

    vi.resetModules()
    const { default: App } = await import('./App')

    render(<App />)

    expect(await screen.findByText('“It works on my machine” — the most feared sentence in software engineering.')).toBeTruthy()
    expect(screen.getByText(/has 0/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'vote' }))

    expect(await screen.findByText(/has 1/i)).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/anecdotes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1',
        content: '“It works on my machine” — the most feared sentence in software engineering.',
        votes: 1,
      }),
    })
  })
})
