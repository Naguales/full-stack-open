import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  afterEach(() => {
    cleanup()
  })

  test('calls the event handler with the right details when a new blog is created', () => {
    const createBlog = vi.fn()

    const { container } = render(
      <BlogForm createBlog={createBlog} onCancel={vi.fn()} />
    )

    const titleInput = container.querySelector('input[name="Title"]')
    const authorInput = container.querySelector('input[name="Author"]')
    const urlInput = container.querySelector('input[name="Url"]')
    const createButton = screen.getByText('create')

    fireEvent.change(titleInput, { target: { value: 'Refactoring UI' } })
    fireEvent.change(authorInput, { target: { value: 'Adam Wathan' } })
    fireEvent.change(urlInput, {
      target: { value: 'https://www.refactoringui.com' }
    })
    fireEvent.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Refactoring UI',
      author: 'Adam Wathan',
      url: 'https://www.refactoringui.com'
    })
  })
})
