const path = require("path");
const puppeteer = require("puppeteer");
const retry = require("../../helperFunctions/retry");
const getPage = require("../../helperFunctions/blockOnPage");
const Err = require("../../helperFunctions/err");

const acquireDownloadLink = async id => {
  const url = `http://smods.ru/?s=${id}`;
  const browser = await puppeteer.launch();

  //OPEN NEW TAB WITH URL
  let page = await getPage(browser);

  //RETRY SMODS PAGE LOAD
  forceQuitRetries = false;
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
      throw new Error("Unable to load SMODS");
    },
    () => forceQuitRetries
  );
  //FIRST PAGE LOAD SUCCESSFUL

  const modExists = await page.$(".skymods-excerpt-btn");

  if (!modExists) {
    await page.screenshot({
      path: path.join(__logDir, "SMODS-mod-unavailable.png"),
      fullPage: true
    });
    await page.close();
    await browser.close();
    throw new Err("Unavailable on SMODS", "FAIL");
  }
  
  /* istanbul ignore next */
  const modsBaseLink = await page.$eval(".skymods-excerpt-btn", el => el.href);

  //RETRY modsBase PAGE LOAD
  forceQuitRetries = false;
  await retry(
    async () => {
      await page.goto(modsBaseLink, { waitUntil: "networkidle2" });
    },
    async () => {
      await page.close();
      page = await getPage(browser);
    },
    async () => {
      await browser.close();
      throw new Error("Unable to load MODSBASE");
    },
    () => forceQuitRetries
  );
  //modsBase PAGE LOAD SUCCESSFUL

  //NO DOWNLOAD BTN EXISTS
  const downloadButtonExists = await page.$("input.download-file-btn");
  if (!downloadButtonExists) {
    await page.screenshot({
      path: path.join(__logDir, "MODSBASE-mod-removed.png"),
      fullPage: true
    });
    await page.close();
    await browser.close();
    throw new Err("Mod removed from MODSBASE", "FAIL");
  }

  //MULTIPLE ATTEMPTS OF PASSING FIRST PAGE - NOT ACTUAL DOWNLOAD PAGE
  await retry(
    async () => {
      await Promise.all([
        page.waitForSelector("button#downloadbtn.download-file-btn", {
          visible: true,
          timeout: 10000
        }),
        page.click("input.download-file-btn")
      ]);
    },
    () => {},
    async () => {
      await page.close();
      await browser.close();
      throw new Error("Unable to go past FREE DOWNLOAD");
    },
    () => false
  );

  let downloadLink;
  await retry(
    async () => {
      const [data] = await Promise.all([
        page.waitForResponse(
          res =>
            res.headers().location &&
            res.headers().location.includes("modsbase")
        ),
        page.click("button#downloadbtn.download-file-btn")
      ]);

      downloadLink = data.headers().location;
    },
    () => {},
    async () => {
      await page.close();
      await browser.close();
      throw new Error("Unable to get FINAL LINK");
    },
    () => false
  );

  await browser.close();

  return downloadLink;
};

module.exports = acquireDownloadLink;
