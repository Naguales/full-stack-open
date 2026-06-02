import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  afterEach(() => {
    cleanup()
  })

  const blog = {
    title: 'The Twelve-Factor App',
    author: 'Adam Wiggins',
    url: 'https://12factor.net/',
    likes: 7,
    user: {
      id: '12345',
      name: 'Rabindranath Tagore'
    }
  }

  const renderBlog = (currentUser) => {
    render(
      <Blog
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        currentUser={currentUser}
      />
    )

    fireEvent.click(screen.getByText('view'))
  }

  test('shows blog information and likes to unauthenticated users, but no buttons', () => {
    renderBlog(null)

    expect(screen.getByText('https://12factor.net/')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
    expect(screen.queryByText('like')).not.toBeInTheDocument()
    expect(screen.queryByText('remove')).not.toBeInTheDocument()
  })

  test('shows only the like button to an authenticated user who is not the creator', () => {
    renderBlog({ id: '67890' })

    expect(screen.getByText('https://12factor.net/')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.queryByText('remove')).not.toBeInTheDocument()
  })

  test('shows both like and remove buttons to the blog creator', () => {
    renderBlog({ id: '12345' })

    expect(screen.getByText('https://12factor.net/')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.getByText('remove')).toBeInTheDocument()
  })

  test('calls the like event handler twice if the like button is clicked twice', () => {
    const handleLike = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        handleDelete={vi.fn()}
        currentUser={{ id: '12345' }}
      />
    )

    fireEvent.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)
  })
})
