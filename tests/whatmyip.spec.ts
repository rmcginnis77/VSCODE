import { test, expect } from '@playwright/test';
import { WhatMyIpPage } from '../pages/whatmyipPage';

test('displays the expected location details and accurate local time', async ({ page }) => {
  const whatMyIpPage = new WhatMyIpPage(page);

  await whatMyIpPage.goto();

  const ipAddress = await whatMyIpPage.getReportedIpAddress();
  const region = await whatMyIpPage.getRegion();
  const country = await whatMyIpPage.getCountry();
  const reportedLocalTime = await whatMyIpPage.getLocalTime();

  expect(region).toBe('Colorado');
  expect(country).toBe('United States (US)');

  const timeMatch = /^\s*(\d{1,2}):(\d{2}):(\d{2})\s*$/;
  const reportedMatch = reportedLocalTime.match(timeMatch);
  if (!reportedMatch) {
    throw new Error(`Unexpected local time format: ${reportedLocalTime}`);
  }

  const reportedSeconds =
    Number(reportedMatch[1]) * 3600 +
    Number(reportedMatch[2]) * 60 +
    Number(reportedMatch[3]);

  const expectedTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const expectedLocalTime = expectedTimeFormatter.format(new Date());
  const expectedMatch = expectedLocalTime.match(timeMatch);
  if (!expectedMatch) {
    throw new Error(`Unexpected expected local time format: ${expectedLocalTime}`);
  }

  const expectedSeconds =
    Number(expectedMatch[1]) * 3600 +
    Number(expectedMatch[2]) * 60 +
    Number(expectedMatch[3]);

  expect(Math.abs(reportedSeconds - expectedSeconds)).toBeLessThanOrEqual(90);

  console.log(
    `Reported IP Address: ${ipAddress} | Region: ${region} | Country: ${country} | Local Time: ${reportedLocalTime} | Expected Denver Time: ${expectedLocalTime}`
  );

  await expect(page.locator('body')).toContainText(new RegExp(`Region:\\s*${region}`, 'i'));
  await expect(page.locator('body')).toContainText(new RegExp(`Country:\\s*${country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'));
  await expect(page.locator('body')).toContainText(new RegExp(`Local Time:\\s*${reportedLocalTime.replace(/:/g, ':')}`, 'i'));
});
