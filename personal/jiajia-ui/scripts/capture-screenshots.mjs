import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.join(__dirname, "..", "examples");

/** Gallery JPG basename (no extension) → source HTML basename */
const cases = [
  "r1-opus",
  "r1-codex",
  "r1-composer",
  "r1-gemini",
  "r1-grok",
  "r2-form",
  "r2-landing",
  "r2-dashboard",
  "r2-list",
  "r2-states",
  "r3-vet",
  "r3-bookstore",
  "r3-weather",
  "r3-billing",
  "r3-education",
  "r3-plants",
  "r3-rental",
  "r3-volunteer",
  "r3-museum",
  "r3-pharmacy",
];

const widths = [1280, 390];

await mkdir(examplesDir, { recursive: true });

const browser = await chromium.launch();
const inventory = [];

for (const name of cases) {
  const filePath = path.join(examplesDir, `${name}.html`);
  const url = `file://${filePath}`;
  for (const width of widths) {
    const height = width === 390 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);
    const suffix = width === 1280 ? "" : "-390";
    const out = path.join(examplesDir, `${name}${suffix}.jpg`);
    await page.screenshot({
      path: out,
      type: "jpeg",
      quality: 82,
      fullPage: true,
    });
    inventory.push(`personal/jiajia-ui/examples/${name}${suffix}.jpg`);
    await context.close();
  }
}

await browser.close();
console.log(JSON.stringify(inventory, null, 2));
