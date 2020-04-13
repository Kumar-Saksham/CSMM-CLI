const getUserConfig = require("../../src/helperFunctions/userConfig/getUserConfig");

after(async () => {
  const testUserConfig = await getUserConfig();
  testUserConfig.store = global.userConfigStoreBackup;
});
