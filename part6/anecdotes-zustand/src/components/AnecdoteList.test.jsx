import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

const mockedHooks = vi.hoisted(() => ({
  useAnecdotes: vi.fn(),
  useFilter: vi.fn(),
  useAnecdoteActions: vi.fn(),
  useNotificationActions: vi.fn(),
}))

vi.mock('../store', () => ({
  useAnecdotes: mockedHooks.useAnecdotes,
  useFilter: mockedHooks.useFilter,
  useAnecdoteActions: mockedHooks.useAnecdoteActions,
}))

vi.mock('../notificationStore', () => ({
  useNotificationActions: mockedHooks.useNotificationActions,
}))

import AnecdoteList from './AnecdoteList'

describe('AnecdoteList', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    mockedHooks.useFilter.mockReturnValue('')
    mockedHooks.useAnecdoteActions.mockReturnValue({
      removeAnecdote: vi.fn(),
      voteAnecdote: vi.fn(),
    })
    mockedHooks.useNotificationActions.mockReturnValue({
      showNotification: vi.fn(),
    })
  })

  test('renders anecdotes sorted by votes in descending order', () => {
    mockedHooks.useAnecdotes.mockReturnValue([
      { id: '1', content: 'A 3-hour outage traced back to a missing semicolon.', votes: 1 },
      { id: '2', content: '“It works on my machine” — the most feared sentence in software engineering.', votes: 9 },
      { id: '3', content: 'A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.', votes: 4 },
    ])

    const { container } = render(<AnecdoteList />)
    const renderedText = container.textContent

    expect(renderedText.indexOf('“It works on my machine” — the most feared sentence in software engineering.')).toBeLessThan(
      renderedText.indexOf('A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.')
    )
    expect(renderedText.indexOf('A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.')).toBeLessThan(
      renderedText.indexOf('A 3-hour outage traced back to a missing semicolon.')
    )
  })

  test('renders only anecdotes matching the current filter', () => {
    mockedHooks.useFilter.mockReturnValue('server')
    mockedHooks.useAnecdotes.mockReturnValue([
      { id: '1', content: '“It works on my machine” — the most feared sentence in software engineering.', votes: 2 },
      { id: '2', content: 'A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.', votes: 5 },
      { id: '3', content: 'Restarted the server. Fixed everything. No idea why.', votes: 1 },
    ])

    render(<AnecdoteList />)

    expect(screen.getByText('A server “mysteriously” crashed every night at 2 AM. Turned out cleaning staff unplugged it to charge a vacuum.')).toBeTruthy()
    expect(screen.getByText('Restarted the server. Fixed everything. No idea why.')).toBeTruthy()
    expect(
      screen.queryByText('“It works on my machine” — the most feared sentence in software engineering.')
    ).toBeNull()
  })
})
