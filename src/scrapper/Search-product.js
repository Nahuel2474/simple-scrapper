import puppeteer from "puppeteer";

export async function SearchProductWithoutImg(word) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Inyectar la biblioteca decimal.js en la página
  await page.addScriptTag({ content: 'var Decimal = require("decimal.js");' });

  await page.goto("https://www.mercadolibre.com.ar");

  await page.type(".nav-search-input", word);
  await page.click(".nav-search-btn");

  await page.waitForSelector(".ui-search-result__wrapper");

  const products = await page.evaluate(async () => {
    const wrappers = document.querySelectorAll(".ui-search-result__wrapper");
    const items = [];

    for (const wrapper of wrappers) {
      const style = window.getComputedStyle(wrapper);
      const displayPropertie = style.display !== "none";
      const displayImportantStyle = style.getPropertyValue("display") !== "none !important";

      if (displayPropertie && displayImportantStyle) {
        
        const titleElement = wrapper.querySelector(".ui-search-item__title");
        const priceElement = wrapper.querySelector(
          ".ui-search-price__second-line > .ui-search-price__part > .andes-money-amount__fraction"
        );

        const linkElement = wrapper.querySelector(".ui-search-link");

        const link = linkElement ? linkElement.getAttribute("href") : null;
        const price = priceElement.textContent.trim();
        if (titleElement) {
          const product = {
            title: titleElement.textContent.trim(),
            price: price,
            priceInUsd: (parseFloat(price.replace(/\./g, "")) / 977).toFixed(2),
            link: link,
          };
          items.push(product);
        }
      }
    }

    return items.slice(0, 100);
  });

  await browser.close();
  return products;
}

export async function SearchProductWithImg(word) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Inyectar la biblioteca decimal.js en la página
  await page.addScriptTag({ content: 'var Decimal = require("decimal.js");' });

  await page.goto("https://www.mercadolibre.com.ar");

  await page.type(".nav-search-input", word);
  await page.click(".nav-search-btn");

  await page.waitForSelector(".ui-search-result__wrapper");

  const products = await page.evaluate(async () => {
    const wrappers = document.querySelectorAll(".ui-search-result__wrapper");
    const items = [];

    for (const wrapper of wrappers) {
      const style = window.getComputedStyle(wrapper);
      if (
        style.display !== "none" &&
        style.getPropertyValue("display") !== "none !important"
      ) {
        const titleElement = wrapper.querySelector(".ui-search-item__title");
        const priceElement = wrapper.querySelector(
          ".ui-search-price__second-line > .ui-search-price__part > .andes-money-amount__fraction"
        );

        const linkElement = wrapper.querySelector(".ui-search-link");
        const imageElement = wrapper.querySelector(
          ".ui-search-result-image__element"
        );

        const link = linkElement ? linkElement.getAttribute("href") : null;
        const price = priceElement.textContent.trim();
        if (titleElement) {
          await imageElement.scrollIntoView();
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const product = {
            title: titleElement.textContent.trim(),
            price: price,
            priceInUsd: (parseFloat(price.replace(/\./g, "")) / 977).toFixed(2),
            link: link,
            image: imageElement.getAttribute("src"),
          };
          items.push(product);
        }
      }
    }

    return items.slice(0, 100);
  });

  await browser.close();
  return products;
}
