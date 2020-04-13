const path = require("path");

const defaultSaveDir = () => {
  const homeDirLoc =
    process.env.LOCALAPPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Application Support"
      : process.env.HOME + "/.local/share");

  const locationInHomeDir = "/Colossal Order/Cities_Skylines/";
  return path.join(homeDirLoc, locationInHomeDir);
};

const defaultTmpDir = () => {
  return path.join(__dirname, "..", "..", "..", "tmp");
};

const defaultConcurrency = () => {
  return 5;
};

const defaultTransferProgressTimeout = () => {
  return 5000;
};

const defaultConfig = {
  path: {
    saveDir: defaultSaveDir(),
    tempDir: defaultTmpDir(),
  },
  process: {
    concurrency: defaultConcurrency(),
    transferProgressTimeout: defaultTransferProgressTimeout(),
  },
};

module.exports.config = defaultConfig;
module.exports.saveDir = defaultSaveDir();
module.exports.tmpDir = defaultTmpDir();
module.exports.concurrency = defaultConcurrency();
module.exports.transferProgressTimeout = defaultTransferProgressTimeout();
