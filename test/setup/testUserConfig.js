const getUserConfig = require("../../src/helperFunctions/userConfig/getUserConfig");
const path = require("path");
const fs = require("fs-extra");

before(async () => {
  const testDir = path.join(__dirname, "..", "..", "tmp", "testDir");
  const testUserConfigStore = {
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

  await fs.ensureDir(testDir);
  await fs.ensureDir(testUserConfigStore.path.saveDir);
  await fs.ensureDir(testUserConfigStore.path.tmpDir);

  global.testDir = testDir;
  global.testUserConfig = testUserConfigStore;

  const userConfig = await getUserConfig(testUserConfigStore);
  global.userConfig = userConfig;
});
