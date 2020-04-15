const { expect, test } = require("@oclif/test");
const getUserConfig = require("../../../src/helperFunctions/userConfig/getUserConfig");
const fs = require("fs-extra");
const path = require("path");
const defaults = require("../../../src/helperFunctions/userConfig/defaultUserConfig");

describe("getUserConfig", () => {
  before(async () => {
    this.ogPath = global.userConfig.path;
    this.backupPath = path.join(
      global.userConfig.path,
      "..",
      "backByGetUserConfig.json"
    );
    await fs.copy(this.ogPath, this.backupPath);
  });
  after(async () => {
    fs.ensureFile(this.ogPath);
    await fs.move(this.backupPath, this.ogPath, { overwrite: true });
  });

  let sampleUserConfig = {
    path: {
      saveDir:
        "/Users/username/Library/Application Support/Colossal Order/Cities_Skylines/",
      tmpDir: "/Users/username/Documents/Projects/CSMM-CLI/CSMM-CLI/tmp",
    },
    process: {
      concurrency: 5,
      transferProgressTimeout: 5000,
    },
    lastUpdated: "2020-04-14T22:59:22.466Z",
  };

  test
    .stub("setup", () => Promise.resolve)
    .do(async () => {
      await fs.remove(this.ogPath);
    })
    .it("should make a default userConfig if doesn't exist", async () => {
      const newUserConfig = await getUserConfig(global.testUserConfig);
      expect(newUserConfig.store.path).to.deep.equal(
        global.testUserConfig.path
      );
      expect(newUserConfig.store.process).to.deep.equal(
        global.testUserConfig.process
      );
    });

  test
    .do(async () => {
      await fs.writeFile(this.ogPath, "");
    })
    .it("should add default info if userConfig is empty", async () => {
      const newUserConfig = await getUserConfig(global.testUserConfig);
      expect(newUserConfig.store.path).to.deep.equal(
        global.testUserConfig.path
      );
      expect(newUserConfig.store.process).to.deep.equal(
        global.testUserConfig.process
      );
    });

  test
    .stub("dirValidation", () => true)
    .do(async () => {
      await fs.writeJSON(this.ogPath, global.testUserConfig);
    })
    .it("should fetch information if manager contains valid data", async () => {
      const filledUserConfig = await getUserConfig({});
      expect(filledUserConfig.store.path).to.deep.equal(
        global.testUserConfig.path
      );
      expect(filledUserConfig.store.process).to.deep.equal(
        global.testUserConfig.process
      );
    });

  test
    .do(async () => {
      const editedTestUserConfig = { ...global.testUserConfig };
      editedTestUserConfig.process.concurrency = 15;
      await fs.writeJSON(this.ogPath, editedTestUserConfig);
    })
    .it("should reset userConfig if data isn't valid", async () => {
      const validUserConfig = await getUserConfig(global.testUserConfig);
      expect(validUserConfig.store.path).to.deep.equal(
        global.testUserConfig.path
      );
      expect(validUserConfig.store.process).to.deep.equal(
        global.testUserConfig.process
      );
    });
});
