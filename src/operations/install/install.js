const fs = require("fs-extra");
const path = require("path");
const unpack = require("./unpack");
const getManager = require("../../helperFunctions/manager/getManager");
const locationOf = require("./categoryLocation");

// const lastDir = link => {
//   let dirs = link.split("/");
//   const lastDir = dirs[dirs.length - 1].trim().length
//     ? dirs[dirs.length - 1]
//     : dirs[dirs.length - 2];
//   return lastDir.trim();
// };

const capitalSnakeCase = (str) => {
  return str
    .match(/[a-zA-Z]+/g)
    .join("_")
    .toUpperCase();
};

const installer = async (article, downloadedFilePath) => {
  const manager = await getManager();
  const unpackedDir = __unpackedDir;
  const unpackedItemDir = await unpack(downloadedFilePath, unpackedDir);

  const jsonContent = JSON.stringify(article);

  const itemFileLink = path.join(unpackedItemDir, "item.json");
  await fs.ensureFile(itemFileLink);
  await fs.writeFile(itemFileLink, jsonContent);

  const category = capitalSnakeCase(article.categories[0]);

  const installLocation = path.join(locationOf(category), article.id);

  //await fs.ensureDir(installLocation);
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
