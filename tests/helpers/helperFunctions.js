import { expect } from "@playwright/test";

export async function createNewPoll(page) {
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Create" })
    .click();

  // Verify navigation to the event creation page
  await expect(page.getByRole("heading", { name: "Event" })).toBeVisible();

  // Fill in the event details
  await page.getByText("Title").click();
  await page.getByPlaceholder("Monthly Meetup").fill("Stand-up");
  await page.getByText("Location(Optional)").click();
  await page.getByText("Location").click();
  await page.getByPlaceholder("Joe's Coffee Shop").fill("Office");
  await page.getByText("Description").click();
  await page
    .getByPlaceholder("Hey everyone, please choose")
    .fill("Please come prepared for a fun time!");

  // Select week view and verify elements
  await page.getByRole("tab", { name: "Week view" }).click();
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
  await expect(page.getByText("12:00 AM")).toBeVisible();

  // Select month view and specify times
  await page.getByRole("tab", { name: "Month view" }).click();
  await page.getByRole("button", { name: "23" }).click();
  await expect(page.getByText("Specify times")).toBeVisible();
  await page.getByTestId("specify-times-switch").click();
  await page.getByRole("button", { name: "Add time option" }).click();
  await page.getByRole("button", { name: "Add time option" }).click();

  // Create the poll
  await page.getByRole("button", { name: "Create poll" }).click();

  // Navigate to the poll page and verify share options
  await expect(page.getByRole("heading", { name: "Share" })).toBeVisible();
  await page.getByRole("button", { name: "localhost:3000/invite/" }).click();
}

export async function participantVote(page1, participantName, email) {
  // Vote on the poll
  await page1.getByTestId("vote-selector").first().click();

  // Leave a comment on the poll
  await page1
    .getByRole("button", { name: "Leave a comment on this poll" })
    .click();
  await page1.getByPlaceholder("Leave a comment on this poll").fill("Ready");
  await page1.getByPlaceholder("Your name…").click();
  await page1.getByPlaceholder("Your name…").fill(participantName);
  await page1.getByRole("button", { name: "Add Comment" }).click();
  await page1.getByRole("button", { name: "Continue" }).click();

  // Add a new participant
  await expect(
    page1.getByRole("heading", { name: "New participant" }),
  ).toBeVisible();
  await page1.getByText("Name").click();
  await page1.getByPlaceholder("Jessie Smith").click();
  await page1.getByPlaceholder("Jessie Smith").fill(participantName);
  await page1.getByPlaceholder("jessie.smith@example.com").click();
  await page1.getByPlaceholder("jessie.smith@example.com").fill(email);

  // Verify the poll results and submit
  await expect(page1.getByText("Yes1No2")).toBeVisible();
  await page1.getByRole("button", { name: "Submit" }).click();
}

export async function createAccount(page, userName, userEmail) {
  // Navigate to the login page
  await page.getByRole("link", { name: "Login" }).click();
  await expect(page.getByText("Don't have an account?")).toBeVisible();

  // Navigate to the registration page
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByText("Create an account")).toBeVisible();

  // Fill out the registration form
  await page.getByText("Name").click();
  await page.getByPlaceholder("Jessie Smith").fill(userName);
  await page.getByText("Email").click();
  await page.getByPlaceholder("jessie.smith@example.com").fill(userEmail);
  await page.getByRole("button", { name: "Continue" }).click();
}
