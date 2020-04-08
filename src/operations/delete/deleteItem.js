const fs = require("fs-extra");
const getManager = require("../../helperFunctions/manager/getManager");
const colors = require("ansi-colors");
const figures = require("figures");

const deleteItem = async id => {
  const manager = await getManager();
  const installedItems = manager.get("installed");

  if (!installedItems[id]) {
    throw new Error("Item with given id is not installed");
  }

  await fs.remove(installedItems[id].location);

  const name = installedItems[id].title;
  manager.delete(`installed.${id}`);

  return name;
};

module.exports = deleteItem;
