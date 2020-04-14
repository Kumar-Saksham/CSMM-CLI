const getUserConfig = require("../../src/helperFunctions/userConfig/getUserConfig");
const fs = require("fs-extra");

after(async () => {
  await fs.exists(global.bckpFilePath);
  await fs.move(global.bckpFilePath, global.ogPath, { overwrite: true });
});
