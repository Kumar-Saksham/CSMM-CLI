const getUserConfig = require("../../src/helperFunctions/userConfig/getUserConfig");
const path = require("path");
const fs = require("fs-extra");

before(async () => {
  const userConfig = await getUserConfig();
  global.userConfigStoreBackup = userConfig.store;
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

  global.testUserConfig = testUserConfig;
  await fs.ensureDir(testUserConfig.path.saveDir);
  await fs.ensureDir(testUserConfig.path.tmpDir);
  userConfig.store = testUserConfig;
  global.userConfig = userConfig;
});
