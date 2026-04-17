const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  const loginWith = async (page, username, password) => {
    await page.goto('/login')
    await page.locator('input[name="Username"]').fill(username)
    await page.locator('input[name="Password"]').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, title, author, url) => {
    await page.goto('/blogs/new')
    await page.locator('input[name="Title"]').fill(title)
    await page.locator('input[name="Author"]').fill(author)
    await page.locator('input[name="Url"]').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
  }

  const openBlog = async (page, title, author) => {
    await page.goto('/')
    await page.getByRole('link', { name: `${title} by ${author}` }).click()
  }

  beforeEach(async ({ request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    expect(resetResponse.ok()).toBeTruthy()

    const userResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    expect(userResponse.ok()).toBeTruthy()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    await expect(page.locator('.notification.error')).toContainText('wrong username or password')
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    await expect(page).toHaveURL('http://localhost:5173/login')
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a user can create a blog', async ({ page }) => {
      await createBlog(
        page,
        'Simple Made Easy',
        'Rich Hickey',
        'https://www.infoq.com/presentations/Simple-Made-Easy/'
      )

      await expect(page.getByRole('link', { name: 'Simple Made Easy by Rich Hickey' })).toBeVisible()
    })

    test('a user can like a blog', async ({ page }) => {
      await createBlog(
        page,
        'Simple Made Easy',
        'Rich Hickey',
        'https://www.infoq.com/presentations/Simple-Made-Easy/'
      )
      await openBlog(page, 'Simple Made Easy', 'Rich Hickey')

      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a user can delete a blog', async ({ page }) => {
      await createBlog(
        page,
        'Simple Made Easy',
        'Rich Hickey',
        'https://www.infoq.com/presentations/Simple-Made-Easy/'
      )
      await openBlog(page, 'Simple Made Easy', 'Rich Hickey')

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'Simple Made Easy by Rich Hickey' })).toHaveCount(0)
      await expect(page).toHaveURL('http://localhost:5173/')
    })
  })
})
