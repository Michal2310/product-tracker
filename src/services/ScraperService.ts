import { Page } from "puppeteer-core";
import { Product } from "../models/Product";

export const scrapeAmazonForProducts = async (
  page: Page,
  searchQuery: string,
): Promise<Product[]> => {
  try {
    await page.goto("https://www.amazon.com", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await page.waitForSelector("#twotabsearchtextbox");
    await page.type("#twotabsearchtextbox", String(searchQuery));
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 });

    return page.$$eval(".s-result-item", (items: Element[]) => {
      return items
        .map((item) => {
          const imgElement = item.querySelector(".s-image") as HTMLImageElement;
          const titleElement = item.querySelector("h2 .a-link-normal") as HTMLElement;
          const priceElement = item.querySelector(".a-offscreen") as HTMLElement;
          const urlElement = item.querySelector("h2 .a-link-normal") as HTMLAnchorElement;
          return {
            imgSrc: imgElement?.src ?? "",
            title: titleElement?.innerText ?? "",
            price: priceElement?.innerText.slice(1) ?? "",
            url: urlElement?.href ?? null,
          };
        })
        .filter((item) => item.imgSrc && item.price && item.title && item.url);
    });
  } catch (error) {
    throw error;
  }
};
