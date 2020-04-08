const Conf = require("conf");
const path = require("path");
const fs = require("fs-extra");
const schema = require("./managerSchema");

const getManager = async () => {
  const options = {
    schema,
    configName: "manager",
    cwd: __savesDirectory
  };
  let manager;
  try {
    manager = new Conf(options);
  } catch {
    await fs.remove(path.join(__savesDirectory, "manager.json"));
    manager = new Conf(options);
  }
  return manager;
};

module.exports = getManager;
