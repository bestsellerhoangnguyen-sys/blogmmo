import { chromium } from "playwright";
import fs from "node:fs/promises";

const baseUrl = process.env.UI_QA_BASE_URL || "https://www.sspaitools.com";
const widths = [360, 390, 430, 768];
const pages = ["/", "/blog", "/guides", "/admin", "/login"];

const results = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 860 } });
    const page = await context.newPage();

    for (const path of pages) {
      const url = `${baseUrl}${path}`;
      const started = Date.now();
      let status = "ERR";
      let overflow = "N/A";
      let title = "";

      try {
        const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        status = String(response?.status() ?? "NA");
        title = await page.title();
        overflow = await page.evaluate(() => {
          const sw = document.documentElement.scrollWidth;
          const cw = document.documentElement.clientWidth;
          return sw > cw ? `YES (${sw}>${cw})` : "NO";
        });
      } catch (e) {
        status = `ERR: ${String(e).slice(0, 80)}`;
      }

      results.push({ width, path, status, overflow, ms: Date.now() - started, title });
    }

    await context.close();
  }
} finally {
  await browser.close();
}

const lines = [];
lines.push(`# UI QA Report`);
lines.push("");
lines.push(`- Base URL: ${baseUrl}`);
lines.push(`- Generated: ${new Date().toISOString()}`);
lines.push(`- Widths: ${widths.join(", ")}`);
lines.push("");
lines.push(`| Width | Path | HTTP | Overflow-X | Time (ms) | Title |`);
lines.push(`|---:|---|---:|---|---:|---|`);
for (const r of results) {
  lines.push(`| ${r.width} | ${r.path} | ${r.status} | ${r.overflow} | ${r.ms} | ${r.title || "-"} |`);
}

const reportPath = "docs/UI_QA_REPORT.md";
await fs.writeFile(reportPath, lines.join("\n") + "\n", "utf8");
console.log(reportPath);
