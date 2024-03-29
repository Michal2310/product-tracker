import { launch } from "puppeteer-core";

const { BRIGHTDATA_USERNAME, BRIGHTDATA_PASSWORD, BRIGHTDATA_HOST } = process.env;
export const scraper = async () => {
  if (!BRIGHTDATA_USERNAME || !BRIGHTDATA_PASSWORD) throw Error("Invalid credentials");
  let page = null;
  let browser = null;
  try {
    browser = await launch({
      headless: false,
      ignoreHTTPSErrors: true,
      channel: "chrome",
      args: [`--proxy-server=${BRIGHTDATA_HOST}`],
    });
    page = await browser.newPage();
    await page.authenticate({
      username: BRIGHTDATA_USERNAME,
      password: BRIGHTDATA_PASSWORD,
    });

    return { page, browser };
  } catch (e) {
    console.error("run failed", e);
    return { page, browser };
  }
};
