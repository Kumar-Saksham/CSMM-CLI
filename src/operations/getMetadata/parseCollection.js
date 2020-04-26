const parseCollection = async page => {
  /* istanbul ignore next */
  const details = await page.evaluate(() => {
    const output = {};

    output.title = document
      .querySelector(".collectionHeader .workshopItemTitle")
      .innerText.trim();

    output.author = document
      .querySelector(".creatorsBlock .linkAuthor")
      .innerText.trim();

    output.collectionItems = Array.apply(
      null,
      document.querySelectorAll(".collectionChildren .collectionItem")
    ).map(item => {
      id = item.id.split("_")[1];
      title = item.children[2].children[0].text.trim();
      author = item.children[2].children[1].children[0].innerText.trim();
      return {
        id,
        title,
        author
      };
    });

    const fields = Array.apply(
      null,
      document.querySelectorAll(
        ".rightSectionHolder:last-child .detailsStatsContainerLeft > div"
      )
    ).map(div => div.innerText);

    const values = Array.apply(
      null,
      document.querySelectorAll(
        ".rightSectionHolder:last-child .detailsStatsContainerRight > div"
      )
    ).map(div => div.innerText);

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
