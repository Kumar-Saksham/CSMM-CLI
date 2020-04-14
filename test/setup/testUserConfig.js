const getUserConfig = require("../../src/helperFunctions/userConfig/getUserConfig");
const path = require("path");
const fs = require("fs-extra");

before(async () => {
  const userConfig = await getUserConfig();

  const bckpFilePath = path.join(userConfig.path, "..", "back.json");
  await fs.copy(userConfig.path, bckpFilePath);

  const testDir = path.join(__dirname, "..", "..", "tmp", "testDir");
  await fs.ensureDir(testDir);

  const testUserConfig = {
    path: {
      saveDir: path.join(testDir, "saveDir"),
      tmpDir: path.join(testDir, "tmpDir"),
    },
    process: {
      concurrency: 5,
      transferProgressTimeout: 5000,
    },
    lastUpdated: new Date().toISOString(),
  };

  await fs.ensureDir(testUserConfig.path.saveDir);
  await fs.ensureDir(testUserConfig.path.tmpDir);

  global.testUserConfig = testUserConfig;
  global.userConfig = userConfig;
  global.bckpFilePath = bckpFilePath;
  global.ogPath = userConfig.path;
  userConfig.store = testUserConfig;
});
