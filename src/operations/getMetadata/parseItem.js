const moment = require("moment");

const parseItem = async page => {
  const details = await page.evaluate(() => {
    const output = {};
    output.title = document.querySelector(".workshopItemTitle").innerText;
    output.categories = [
      document.querySelector(".rightDetailsBlock a").innerHTML
    ];
    output.author = document
      .querySelector(".creatorsBlock .friendBlockContent ")
      .innerText.split("\n")[0];
    const fields = Object.entries(
      document.querySelectorAll(".detailsStatsContainerLeft > div")
    ).map(div => div[1].innerHTML);
    const values = Object.entries(
      document.querySelectorAll(".detailsStatsContainerRight > div")
    ).map(div => div[1].innerHTML);

    for (const i in fields) {
      if (fields.hasOwnProperty(i) && values.hasOwnProperty(i)) {
        values[i] = values[i].replace(
          /(?<=[a-zA-Z]) (?=@)/,
          `, ${new Date().getFullYear()} `
        );
        output[fields[i].replace(/( )+/g, "").toLowerCase()] = values[i];
      }
    }

    output.requirements = Object.entries(
      document.querySelectorAll("#RequiredItems > a")
    ).map(a => a[1].href.match(/(?<=id=)([0-9]+)/g)[0]);

    output.dlcRequirements = Array.apply(
      null,
      document.querySelectorAll(".requiredDLCContainer .requiredDLCItem")
    ).map(item => {
      const name = item.innerText.trim();
      const link = item.baseURI.trim();
      return { name, link };
    });

    return output;
  });

  await page.close();

  if (details.posted) {
    details.posted = moment(details.posted, "DD MMM YYYY HH:mma").toISOString();
  }
  if (details.updated) {
    details.updated = moment(
      details.updated,
      "DD MMM YYYY HH:mma"
    ).toISOString();
  } else {
    details.updated = details.posted;
  }

  return details;
};

module.exports = parseItem;
