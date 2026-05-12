import { expect, test } from "@playwright/test";

test("home page shows the core Patch Signal guide entry points", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /Patch Signal home/i })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Fast answers for games before the wiki catches up\./i
    })
  ).toBeVisible();
  await expect(page.getByRole("region", { name: /direct answer/i })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Battlestar Galactica: Scattered Hopes Opening Route: What To Do In Your First 3 Maps",
      exact: true
    })
  ).toBeVisible();
});

test("withdrawn game hubs stay private", async ({ page }) => {
  await page.goto("/games/everwind");

  await expect(page.getByRole("heading", { name: "Patch not found.", exact: true }))
    .toBeVisible();
});

test("games index shows Battlestar Galactica as the active public game", async ({ page }) => {
  await page.goto("/games");

  await expect(page.getByRole("heading", { name: "All covered games", exact: true }))
    .toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Battlestar Galactica: Scattered Hopes",
      exact: true
    })
  ).toBeVisible();
  await expect(page.getByText("6 guides")).toBeVisible();
});

test("Battlestar Galactica hub links to the beginner guide", async ({ page }) => {
  await page.goto("/games/battlestar-galactica-scattered-hopes");

  await expect(
    page.getByRole("heading", {
      name: "Battlestar Galactica: Scattered Hopes",
      exact: true
    })
  ).toBeVisible();
  await page
    .getByRole("link", {
      name: "Battlestar Galactica: Scattered Hopes Opening Route: What To Do In Your First 3 Maps",
      exact: true
    })
    .click();

  await expect(page).toHaveURL(
    /\/games\/battlestar-galactica-scattered-hopes\/beginner-guide$/
  );
  await expect(page.locator('[aria-label="Guide details"]')).toContainText("2026-05-11");
});
