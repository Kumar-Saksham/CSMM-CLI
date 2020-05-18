const Conf = require("conf");
const path = require("path");
const fs = require("fs-extra");
const schema = require("./managerSchema");

const getManager = async () => {
  const options = {
    schema,
    configName: "manager",
    cwd: __saveDir
  };
  let manager;
  try {
    manager = new Conf(options);
  } catch(e) {
    await fs.remove(path.join(__saveDir, "manager.json"));
    manager = new Conf(options);
  }
  return manager;
};

module.exports = getManager;
