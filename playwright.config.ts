import { defineConfig, devices } from "@playwright/test";

process.env.NO_PROXY = "127.0.0.1,localhost";
process.env.no_proxy = "127.0.0.1,localhost";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "next dev --hostname 127.0.0.1 --port 4317",
    url: "http://127.0.0.1:4317",
    reuseExistingServer: false
  },
  use: {
    baseURL: "http://127.0.0.1:4317",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
