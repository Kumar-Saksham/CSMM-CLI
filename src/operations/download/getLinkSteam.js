const path = require("path");
const puppeteer = require("puppeteer");
const getPage = require("../../helperFunctions/blockOnPage");
const retry = require("../../helperFunctions/retry");
const Err = require("../../helperFunctions/err");

const acquireDownloadLink2 = async (id) => {
  const url = `http://steamworkshop.download/download/view/${id}`;
  const browser = await puppeteer.launch();
  let page = await getPage(browser, { script: true });

  await retry(
    async () => {
      await page.goto(url, { waitUntil: "networkidle2" });
    },
    async () => {
      await page.close();
      page = await getPage(browser);
    },
    async () => {
      await page.close();
      await browser.close();
      throw new Error("Unable to load first download page");
    }
  );

  const downloadButtonExists = await page.$("#steamdownload.button");
  if (!downloadButtonExists) {
    await page.screenshot({
      path: path.join(
        __logDir,
        "STEAMWORKSHOP-mod-unavailable-for-download.png"
      ),
      fullPage: true,
    });
    await page.close();
    await browser.close();
    throw new Err("Mod not available for download", "FAIL");
  }

  try {
    await page.click("#steamdownload.button");
    await page.waitForSelector("#result > pre > a", {
      visible: true,
      timeout: 100000,
    });
  } catch(e) {
    await page.close();
    await browser.close();
    throw new Err("Unable to download from steam");
  }

  /* istanbul ignore next */
  const downloadLink = await page.$eval("#result > pre > a", (dl) => dl.href);

  await page.close();
  await browser.close();
  if (!downloadLink) throw new Error("NO LINK GRABBED");

  return downloadLink;
};

module.exports = acquireDownloadLink2;
