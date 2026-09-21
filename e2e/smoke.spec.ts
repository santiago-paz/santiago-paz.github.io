import { test, expect, type ConsoleMessage, type Page } from '@playwright/test'

// Collect anything the browser reports as broken. A static export hides
// hydration mismatches from the build: the HTML is written fine, and only a
// real browser rerunning the client components notices. That is what this
// catches, and neither the build nor the unit tests can.
const watchForErrors = (page: Page): string[] => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message: ConsoleMessage) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  return errors
}

// The sitemap is generated from the same data the pages are, so reading it back
// asserts a real invariant: every URL the site advertises to crawlers is a page
// the export actually wrote. It is fetched over HTTP rather than read from
// `out/`, because the test files load before the web server has built anything.
test('every URL in the sitemap is a page that loads', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)

  const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, loc]) => new URL(loc).pathname,
  )
  expect(paths.length).toBeGreaterThan(0)

  for (const path of paths) {
    const response = await request.get(path)
    // Soft, so one dead slug does not hide the rest of the list.
    expect.soft(response.status(), `${path} should serve`).toBe(200)
  }
})

test('the home page hydrates without browser errors', async ({ page }) => {
  const errors = watchForErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Santiago Paz')

  // The nav is a client component reading `usePathname`. Waiting for it proves
  // React took over, so anything collected by now is a real error.
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
  expect(errors).toEqual([])
})

test('the nav moves between pages on the client', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main' })

  await nav.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')

  await nav.getByRole('link', { name: 'Writing' }).click()
  await expect(page).toHaveURL(/\/writing\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writing')

  // `usePathname` drives `aria-current`, so this is the client router agreeing
  // with the URL rather than the prerendered HTML.
  await expect(nav.getByRole('link', { name: 'Writing' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('a writing post opens from the index', async ({ page }) => {
  await page.goto('/writing/')
  const firstPost = page.locator('main a[href^="/writing/"]').first()
  const heading = await firstPost.innerText()

  await firstPost.click()
  await expect(page).toHaveURL(/\/writing\/.+\//)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
})

test('the renamed project keeps its old URL working', async ({ page }) => {
  // A meta refresh, because GitHub Pages has no redirect layer. Only a browser
  // follows it, so the build and the unit tests cannot check this.
  await page.goto('/projects/splitberlin/')
  await expect(page).toHaveURL(/\/projects\/contract-lens\/$/)
})

test('the 404 page renders', async ({ page }) => {
  // Requested by filename on purpose. GitHub Pages answers a missing path with
  // `404.html`, but `python3 -m http.server` answers with its own bare 404, so
  // asking for a made-up path here would test the harness, not the site.
  const response = await page.goto('/404.html')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
})
