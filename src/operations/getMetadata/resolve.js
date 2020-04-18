const colors = require("ansi-colors");
const parseCollection = require("./parseCollection");
const parseItem = require("./parseItem");
const choose = require("../../helperFunctions/enquirerPrompts/choose");
const retry = require("../../helperFunctions/retry");
const getPage = require("../../helperFunctions/blockOnPage");
const promisePool = require("../../helperFunctions/promisePool");
const Err = require("../../helperFunctions/err");
const selectFromList = require("../../helperFunctions/enquirerPrompts/selectList");

const articleResolver = async (
  id,
  finalItemDirectory,
  browser,
  pendingStage = []
) => {
  const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`;
  let page = await getPage(browser);

  await retry(
    async () => {
      await page.goto(url, { waitUntil: "networkidle2" });
      /* istanbul ignore next */
      await page.waitForFunction(
        () => {
          return (
            document.querySelector(".breadcrumbs") ||
            document.querySelector(".error_ctn")
          );
        },
        { timeout: 20000 }
      );
    },
    async (e) => {
      await page.close();
      page = await getPage(browser);
    },
    async () => {
      const options = {
        "Ignore this item": async () => {
          console.log("IGNORING ITEM");
          await page.close();
          throw new Err("Unable to load steam page");
        },
        "Quit Program": async () => {
          console.log("EXITING...");
          await page.close();
          process.exit();
        },
      };
      const message = "Unable to load steam page. Choose one:";
      await choose(message, options);
    },
    () => {}
  );

  if (await page.$(".error_ctn")) {
    await page.close();
    throw new Err("No such item found.", "FAIL");
  }

  /* istanbul ignore next */
  const breadcrumbs = await page.$eval(".breadcrumbs", (str) => {
    return str.innerText.toLowerCase();
  });

  const ofCitiesSkylines =
    breadcrumbs.includes("cities") && breadcrumbs.includes("skylines");

  if (!ofCitiesSkylines) {
    await page.close();
    throw new Err("Currently only supports mods for Cities: Skylines", "FAIL");
  }

  const isCollection = breadcrumbs.includes("collection");

  if (isCollection) {
    const collectionDetails = await parseCollection(page);
    console.log(`${colors.green(collectionDetails.title)} collection found`);

    let res;
    if (__edit) {
      res = await selectFromList(
        collectionDetails.collectionItems,
        "Collection Items"
      );
    } else {
      res = collectionDetails.collectionItems;
    }

    console.log(
      colors.yellow("Grabbing rest of the details"),
      `${colors.grey("(It's not stuck, big collections can take a while)")}`
    );

    await promisePool(
      res.map((item) => () => {
        return articleResolver(item.id, finalItemDirectory, browser);
      }),
      8
    );
  } else {
    const itemDetails = await parseItem(page);

    if (itemDetails.requirements.length > 0) {
      pendingStage.push(id);
      //requirements are present
      for (requirementId of itemDetails.requirements) {
        if (
          !finalItemDirectory[requirementId] &&
          !pendingStage.includes(requirementId)
        ) {
          try {
            await articleResolver(
              requirementId,
              finalItemDirectory,
              browser,
              pendingStage
            );
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      pendingStage.pop();
    }
    itemDetails.id = id;
    finalItemDirectory[id] = itemDetails;
  }
};

module.exports = articleResolver;
