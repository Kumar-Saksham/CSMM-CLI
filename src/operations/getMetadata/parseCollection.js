const parseCollection = async (page) => {
  /* istanbul ignore next */
  const details = await page.evaluate(() => {
    const output = {};

    try {
      output.title = document
        .querySelector(".collectionHeader .workshopItemTitle")
        .innerText.trim();
    } catch (e) {
      output.title = "UNKNOWN_COLLECTION_TITLE";
    }

    try {
      output.author = document
        .querySelector(".creatorsBlock .linkAuthor")
        .innerText.trim();
    } catch (e) {
      output.author = "UNKNOWN_COLLECTION_AUTHOR";
    }

    output.collectionItems = Array.apply(
      null,
      document.querySelectorAll(".collectionChildren .collectionItem")
    ).map((item) => {
      const id = item.id.split("_")[1];
      let title, author;
      try {
        title = item.children[2].children[0].text.trim();
      } catch (e) {
        title = "UNKNOWN_COLLECTION_ITEM_TITLE";
      }
      try {
        author = item.children[2].children[1].children[0].innerText.trim();
      } catch (e) {
        author = "UNKNOWN_COLLECTION_ITEM_AUTHOR";
      }
      
      return {
        id,
        title,
        author,
      };
    });

    const fields = Array.apply(
      null,
      document.querySelectorAll(
        ".rightSectionHolder:last-child .detailsStatsContainerLeft > div"
      )
    ).map((div) => div.innerText);

    const values = Array.apply(
      null,
      document.querySelectorAll(
        ".rightSectionHolder:last-child .detailsStatsContainerRight > div"
      )
    ).map((div) => div.innerText);

    for (const i in fields) {
      if (fields.hasOwnProperty(i) && values.hasOwnProperty(i)) {
        output[fields[i].replace(/( )+/g, "").toLowerCase()] = values[i];
      }
    }

    return output;
  });

  await page.close();

  //RETURN TEMPERORY PACKAGE QUEUE TO BE MERGED TO REAL PACKAGE QUEUE
  return details;
};

module.exports = parseCollection;
