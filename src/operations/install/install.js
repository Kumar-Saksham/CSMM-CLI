const fs = require("fs-extra");
const path = require("path");
const unpack = require("./unpack");
const getManager = require("../../helperFunctions/manager/getManager");
const relativePathOf = require("./categoryLocation");

const installer = async (article, downloadedFilePath) => {
  const manager = await getManager();

  const unpackedDir = __unpackedDir;
  const unpackedItemDir = await unpack(downloadedFilePath, unpackedDir);

  const itemFileLink = path.join(unpackedItemDir, "item.json");
  await fs.ensureFile(itemFileLink);
  await fs.writeJSON(itemFileLink, article);

  const installLocation = path.join(
    __saveDir,
    relativePathOf(article.categories[0]),
    article.id
  );

  try {
    await fs.move(unpackedItemDir, installLocation, { overwrite: true });
  } catch {
    throw new Error("ERROR WHILE MOVING");
  }

  manager.set({
    installed: {
      ...manager.get("installed"),
      [article.id]: {
        title: article.title,
        updated: article.updated,
        location: installLocation,
        id: article.id,
      },
    },
  });
};

module.exports = installer;
