const puppeteer = require("puppeteer");
const resolve = require("./resolve");

const getMetadata = async id => {
  const browser = await puppeteer.launch();
  const articlesDirectory = {};

  try {
    await resolve(id, articlesDirectory, browser);
    await browser.close();
  } catch (e) {
    await browser.close();
    throw e;
  }

  return articlesDirectory;
};

module.exports = getMetadata;
