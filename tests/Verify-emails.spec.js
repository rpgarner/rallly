// @ts-check
import { test, expect } from "@playwright/test";
import { dashboardUrl, userName } from "./constants/constants";
import { createAccount } from "./helpers/helperFunctions";

test("Check for verify email", async ({ page, browser }) => {
  // Navigate to the dashboard
  await page.goto(dashboardUrl);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

  // Generate a unique email for the user
  const userEmail = `nobody${Date.now()}@example.com`;

  // Create a new account
  await createAccount(page, userName, userEmail);

  // Verify that the email verification page is visible
  await expect(page.getByRole("heading", { name: "Verify your email" })).toBeVisible();

  // Open a new browser context and navigate to the email client
  const context = await browser.newContext();
  const newPage = await context.newPage();
  await newPage.goto("http://mailpit.rallly.orb.local/");
  await expect(newPage.getByRole("link", { name: "MailpitMailpit" })).toBeVisible();

  // Open the verification email
  await newPage.getByPlaceholder("Search mailbox").click();
  await newPage.getByPlaceholder("Search mailbox").fill(userEmail);
  await newPage.getByPlaceholder("Search mailbox").press("Enter");
  await newPage.getByRole("link", { name: `Rallly To:` }).click();
  

  // Verify the email contains the verification heading
  await expect(
    newPage.locator("#preview-html").contentFrame().getByRole("heading", { name: "Verify your email address" })
  ).toBeVisible();
});
