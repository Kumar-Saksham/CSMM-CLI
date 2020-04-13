const path = require("path");
const fs = require("fs-extra");
const getUserConfig = require("../../helperFunctions/userConfig/getUserConfig");

module.exports = async function (opts) {
  const userConfig = await getUserConfig();

  global.__transferProgressTimeout = userConfig.get(
    "process.transferProgressTimeout"
  );
  global.__concurrencyLimit = userConfig.get("process.concurrency");
  global.__saveDir = userConfig.get("path.saveDir");
  global.__tmpDir = userConfig.get("path.tmpDir");

  global.__logDir = path.join(__tmpDir, "logs");
  global.__packedDir = path.join(__tmpDir, "packed");
  global.__unpackedDir = path.join(__tmpDir, "unpacked");

  await fs.ensureDir(__logDir);
  await fs.ensureDir(__packedDir);
  await fs.ensureDir(__unpackedDir);
};
