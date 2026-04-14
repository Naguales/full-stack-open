const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  const blogTitleAuthor = (page, title, author) =>
    page.locator('.blog .blog-title-author').filter({ hasText: `${title} by ${author}` })

  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    expect(resetResponse.ok()).toBeTruthy()

    const firstUserResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    expect(firstUserResponse.ok()).toBeTruthy()

    const secondUserResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Rabindranath Tagore',
        username: 'tagore',
        password: 'rabindra',
      },
    })
    expect(secondUserResponse.ok()).toBeTruthy()

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText(/username/i)).toBeVisible()
    await expect(page.getByText(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('mluukkai')
      await page.locator('input[name="Password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('mluukkai')
      await page.locator('input[name="Password"]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorMessage = page.locator('.notification.error')

      await expect(errorMessage).toContainText('wrong username or password')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('mluukkai')
      await page.locator('input[name="Password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input[name="Title"]').fill('Simple Made Easy')
      await page.locator('input[name="Author"]').fill('Rich Hickey')
      await page.locator('input[name="Url"]').fill('https://www.infoq.com/presentations/Simple-Made-Easy/')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(blogTitleAuthor(page, 'Simple Made Easy', 'Rich Hickey')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(blogTitleAuthor(page, 'Simple Made Easy', 'Rich Hickey')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = page.locator('.blog').filter({ hasText: 'Simple Made Easy by Rich Hickey' })

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByText('likes 0')).toBeVisible()

      await blog.getByRole('button', { name: 'like' }).click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who added it', async ({ page }) => {
      const blog = page.locator('.blog').filter({ hasText: 'Simple Made Easy by Rich Hickey' })

      await blog.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(blog).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page }) => {
      const blog = page.locator('.blog').filter({ hasText: 'Simple Made Easy by Rich Hickey' })

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.locator('input[name="Username"]').fill('tagore')
      await page.locator('input[name="Password"]').fill('rabindra')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Rabindranath Tagore logged in')).toBeVisible()

      const otherUserView = page.locator('.blog').filter({ hasText: 'Simple Made Easy by Rich Hickey' })
      await otherUserView.getByRole('button', { name: 'view' }).click()

      await expect(otherUserView.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are arranged in order according to likes', async ({ page }) => {
      const createBlog = async (title, author, url) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.locator('input[name="Title"]').fill(title)
        await page.locator('input[name="Author"]').fill(author)
        await page.locator('input[name="Url"]').fill(url)
        await page.getByRole('button', { name: 'create' }).click()
        await expect(blogTitleAuthor(page, title, author)).toBeVisible()
      }

      const likeBlog = async (title, author, times) => {
        const blog = page.locator('.blog').filter({ hasText: `${title} by ${author}` })

        await blog.getByRole('button', { name: 'view' }).click()

        for (let index = 0; index < times; index += 1) {
          await blog.getByRole('button', { name: 'like' }).click()
          await expect(blog.getByText(`likes ${index + 1}`)).toBeVisible()
        }
      }

      await createBlog('The Twelve-Factor App', 'Adam Wiggins', 'https://12factor.net/')
      await createBlog('Paxos Made Simple', 'Leslie Lamport', 'https://lamport.azurewebsites.net/pubs/paxos-simple.pdf')

      await likeBlog('Simple Made Easy', 'Rich Hickey', 2)
      await likeBlog('The Twelve-Factor App', 'Adam Wiggins', 1)

      const blogTexts = await page.locator('.blog .blog-title-author').allTextContents()

      await expect(blogTexts[0]).toContain('Simple Made Easy by Rich Hickey')
      await expect(blogTexts[1]).toContain('The Twelve-Factor App by Adam Wiggins')
      await expect(blogTexts[2]).toContain('Paxos Made Simple by Leslie Lamport')
    })
  })
})
