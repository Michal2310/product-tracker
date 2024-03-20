import { launch } from "puppeteer-core";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const { BRIGHTDATA_USERNAME, BRIGHTDATA_PASSWORD } = process.env;
export async function scrape(url: string) {
  try {
    const browser = await launch({
      headless: true,
      channel: "chrome",
      args: ["--proxy-server=brd.superproxy.io:22225"],
    });

    const page = await browser.newPage();

    await page.authenticate({
      username: BRIGHTDATA_USERNAME!,
      password: BRIGHTDATA_PASSWORD!,
    });

    await page.goto(url);
    await page.close();
  } catch (e) {
    console.error("run failed", e);
  }
}
