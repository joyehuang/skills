import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const examplesDir = path.join(root, "examples");
const assetsDir = path.join(root, "assets");

const pages = [
  "landing",
  "card-list",
  "form-login",
  "states",
  "qa-chat",
  "mobile-nav",
  "dashboard",
  "settings",
  "profile-home",
  "article-longread",
  "search-results",
  "notifications-toasts",
  "modal-drawer",
  "data-table",
  "onboarding",
  "tags-filters",
  "filo-expressions",
  "pricing",
];

const widths = [1280, 390];

await mkdir(assetsDir, { recursive: true });

const browser = await chromium.launch();
const inventory = [];

for (const name of pages) {
  const filePath = path.join(examplesDir, `${name}.html`);
  const url = `file://${filePath}`;
  for (const width of widths) {
    const height = width === 390 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(400);
    const out = path.join(assetsDir, `${name}-${width}.jpg`);
    await page.screenshot({
      path: out,
      type: "jpeg",
      quality: 82,
      fullPage: true,
    });
    inventory.push({ path: `personal/jiajia-ui/assets/${name}-${width}.jpg`, width });
    await context.close();
  }
}

await browser.close();
console.log(JSON.stringify(inventory, null, 2));
