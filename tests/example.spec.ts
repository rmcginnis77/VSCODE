import { test, expect } from '@playwright/test';

test('homepage has the correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveTitle(/Playwright/);
  await expect(
    page.getByRole('heading', {
      name: /Playwright enables reliable/i,
    })
  ).toBeVisible();
});
