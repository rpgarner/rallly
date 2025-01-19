import { test, expect } from "@playwright/test";
import {
  dashboardUrl,
  participant1,
  participant2,
  participant1Email,
  participant2Email,
} from "./constants/constants";
import { createNewPoll } from "./helpers/helperFunctions";

// Function to handle participant voting
async function participantVote(page, participantName, email) {
  // Select vote option
  await page.getByTestId("vote-selector").first().click();

  // Leave a comment
  await page.getByRole("button", { name: "Leave a comment on this poll" }).click();
  await page.getByPlaceholder("Leave a comment on this poll").fill("Ready");
  await page.getByPlaceholder("Your name…").click();
  await page.getByPlaceholder("Your name…").fill(participantName);
  await page.getByRole("button", { name: "Add Comment" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Add participant details
  await expect(page.getByRole("heading", { name: "New participant" })).toBeVisible();
  await page.getByText("Name").click();
  await page.getByPlaceholder("Jessie Smith").click();
  await page.getByPlaceholder("Jessie Smith").fill(participantName);
  await page.getByPlaceholder("jessie.smith@example.com").click();
  await page.getByPlaceholder("jessie.smith@example.com").fill(email);

  // Verify the poll results and submit
  await expect(page.getByText("Yes1No2")).toBeVisible();
  await page.getByRole("button", { name: "Submit" }).click();
}

test("Participants can cast votes and leave comment", async ({ page, context }) => {
  // Navigate to the dashboard
  await page.goto(dashboardUrl);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

  // Create new poll
  await createNewPoll(page);

  // navigate to the poll link
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("link").click();
  const page1 = await page1Promise;
  await expect(page1.getByRole("heading", { name: "Participants" })).toBeVisible();

  // Participant 1 votes
  await participantVote(page1, participant1, participant1Email);

  // Check participant vote and comment
  await expect(page1.getByText("Participants1")).toBeVisible();
  await expect(page1.getByTestId("comment").getByText(participant1)).toBeVisible();

  // Participant 2 votes
  await page1.getByTestId("add-participant-button").click();
  await participantVote(page1, participant2, participant2Email);

  // Check participant 2 vote
  await expect(page1.getByText("Participants2")).toBeVisible();
});
