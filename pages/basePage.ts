import { type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getBodyText(): Promise<string> {
    return (await this.page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  }
}
