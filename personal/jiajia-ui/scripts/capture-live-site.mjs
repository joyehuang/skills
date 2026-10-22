/** Live site capture for SKILL calibration — output to /tmp only, never commit. */
import { chromium } from "playwright";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const outDir = process.env.JIAJIA_CAPTURE_DIR || "/tmp/jiajia-site-capture";
await mkdir(outDir, { recursive: true });

const pages = [
  { slug: "home", url: "https://jiajia.fun/" },
  { slug: "topics", url: "https://jiajia.fun/topics" },
  { slug: "entries", url: "https://jiajia.fun/entries" },
  { slug: "interviews", url: "https://jiajia.fun/interviews" },
  { slug: "qa-public", url: "https://jiajia.fun/entries?type=discussion" },
  { slug: "about", url: "https://jiajia.fun/about" },
];

const widths = [1280, 390];

const browser = await chromium.launch();
const results = [];

for (const { slug, url } of pages) {
  for (const width of widths) {
    const height = width === 390 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(2500);
      const file = path.join(outDir, `${slug}-${width}.jpg`);
      await page.screenshot({
        path: file,
        type: "jpeg",
        quality: 85,
        fullPage: true,
      });
      const title = await page.title();
      results.push({ slug, width, file, title, finalUrl: page.url() });
    } catch (e) {
      results.push({ slug, width, error: String(e), finalUrl: page.url() });
    }
    await context.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
