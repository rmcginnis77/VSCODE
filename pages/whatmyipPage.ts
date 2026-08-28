import { type Page } from '@playwright/test';
import { BasePage } from './basePage';

export class WhatMyIpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('https://www.whatsmyip.com/');
  }

  async getReportedIpAddress(): Promise<string> {
    const bodyText = await this.getBodyText();
    const ipMatch = bodyText.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);

    if (!ipMatch) {
      throw new Error('No IP address found on the whatsmyip.com page.');
    }

    return ipMatch[0];
  }

  async getCountry(): Promise<string> {
    return this.extractDetail('Country:', /Country:\s*([^\n]+?)(?=\s+Region:|\s+City:|\s+Zip:|\s+Lat\/Long:|\s+Timezone:|\s+Local Time:|$)/i);
  }

  async getRegion(): Promise<string> {
    return this.extractDetail('Region:', /Region:\s*([^\n]+?)(?=\s+City:|\s+Zip:|\s+Lat\/Long:|\s+Timezone:|\s+Local Time:|$)/i);
  }

  async getLocalTime(): Promise<string> {
    return this.extractDetail('Local Time:', /Local Time:\s*(\d{1,2}:\d{2}:\d{2})/i);
  }

  private async extractDetail(label: string, regex: RegExp): Promise<string> {
    const bodyText = await this.getBodyText();
    const match = bodyText.match(regex);

    if (!match) {
      throw new Error(`Could not find "${label}" in the whatsmyip.com page content.`);
    }

    return match[1].trim();
  }
}
