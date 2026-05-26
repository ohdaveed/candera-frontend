/* global process */
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// eslint-disable-next-line no-undef
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// eslint-disable-next-line no-undef
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

test.describe("Backend Integration", () => {
  test("Supabase REST API returns products", async ({ request }) => {
    const response = await request.get(`${supabaseUrl}/rest/v1/products?select=*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);

    // Verify a specific product from our seed data
    const seashell = products.find((p) => p.slug === "seashell-garden-glow");
    expect(seashell).toBeDefined();
    expect(seashell.name).toBe("Seashell Garden Glow");
  });

  test("Frontend displays products from Supabase", async ({ page }) => {
    // Navigate to the collection page (or home page where products are listed)
    await page.goto("/");

    // Check for product names visible on the page
    // Using a more flexible locator for the product name
    await expect(page.getByText("Seashell Garden Glow")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Meadowlight Botanical")).toBeVisible();
    await expect(page.getByText("Crimson Noir")).toBeVisible();
  });
});
