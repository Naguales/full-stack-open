import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders title and author, but not url or likes by default', () => {
    const blog = {
      title: 'The Twelve-Factor App',
      author: 'Adam Wiggins',
      url: 'https://12factor.net/',
      likes: 7,
      user: {
        id: '12345',
        name: 'Rabindranath Tagore',
      },
    }

    const { container } = render(
      <Blog
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        currentUser={{ id: '12345' }}
      />
    )

    const compactView = container.querySelector('.blog-title-author')
    const detailsView = container.querySelector('.blog-details')

    expect(compactView).toHaveTextContent('The Twelve-Factor App by Adam Wiggins')
    expect(detailsView).toBeNull()
    expect(screen.queryByText('https://12factor.net/')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 7')).not.toBeInTheDocument()
  })

  test('renders url and likes when the view button is clicked', () => {
    const blog = {
      title: 'The Twelve-Factor App',
      author: 'Adam Wiggins',
      url: 'https://12factor.net/',
      likes: 7,
      user: {
        id: '12345',
        name: 'Rabindranath Tagore',
      },
    }

    render(
      <Blog
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        currentUser={{ id: '12345' }}
      />
    )

    const button = screen.getByText('view')
    fireEvent.click(button)

    expect(screen.getByText('https://12factor.net/')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
  })

  test('calls the like event handler twice if the like button is clicked twice', () => {
    const blog = {
      title: 'The Twelve-Factor App',
      author: 'Adam Wiggins',
      url: 'https://12factor.net/',
      likes: 7,
      user: {
        id: '12345',
        name: 'Rabindranath Tagore',
      },
    }

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
