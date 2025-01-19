import { test, expect } from "@playwright/test";
import { dashboardUrl, userName } from "./constants/constants";
import { createNewPoll } from "./helpers/helperFunctions";

test("create, update, comment, delete a poll", async ({ page }) => {
  // Navigate to the dashboard
  await page.goto(dashboardUrl);

  // Check dashboard visibility and navigate to create poll page
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

  // Create new poll
  await createNewPoll(page);

  // Handle popup for sharing the poll
  await page.getByRole('button', { name: 'Close' }).click();

  // Edit poll details
  await page.getByRole('button', { name: 'Manage' }).click();
  await page.getByRole('menuitem', { name: 'Edit details' }).click();
  await page.getByText('Title').click();
  await page.getByPlaceholder('Monthly Meetup').fill('Weekly Stand-up');
  await page.getByPlaceholder('Joe\'s Coffee Shop').click();
  await page.getByText('Location').click();
  await page.getByPlaceholder('Joe\'s Coffee Shop').fill('Remote');
  await page.getByText('Description').click();
  await page.getByPlaceholder('Hey everyone, please choose').fill('Please come prepared for a fun time! Will be meeting virtually.');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('poll-title')).toBeVisible();

  // Edit poll options
  await page.getByRole('button', { name: 'Manage' }).click();
  await page.getByRole('menuitem', { name: 'Edit options' }).click();
  await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
  await page.getByRole('button', { name: '24' }).click();
  await page.getByRole('button', { name: 'Add time option' }).nth(1).click();
  await page.getByRole('button', { name: 'Add time option' }).nth(1).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('heading', { name: 'Participants' })).toBeVisible();

  // Add participant
  await page.getByTestId('add-participant-button').click();
  await expect(page.getByRole('cell', { name: 'You' })).toBeVisible();
  await page.locator('.absolute > .flex').first().click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'New participant' })).toBeVisible();
  await page.getByText('Name').click();
  await page.getByText('Name').click();
  await page.getByPlaceholder('Jessie Smith').click();
  await page.getByPlaceholder('Jessie Smith').fill(userName);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('div').filter({ hasText: /^1$/ })).toBeVisible();

  // Leave a comment
  await page.getByRole('button', { name: 'Leave a comment on this poll' }).click();
  await page.getByPlaceholder('Leave a comment on this poll').fill('This is a test of comments');
  await page.getByPlaceholder('Your name…').click();
  await page.getByPlaceholder('Your name…').fill(userName);
  await page.getByRole('button', { name: 'Add Comment' }).click();
  await expect(page.getByTestId('comment').getByText(userName)).toBeVisible();

  // Delete poll
  await page.getByRole('button', { name: 'Manage' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Delete poll' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();

  // Verify poll deletion
  await expect(page.getByText('No polls')).toBeVisible();

});
