const { expect, test } = require("@oclif/test");
const {
  saveDirValidation,
  tmpDirValidation,
  concurrencyValidation,
  transferProgressTimeoutValidation,
  dirValidation,
} = require("../../src/helperFunctions/userConfig/validation");
const path = require("path");

describe("HOOK parseUserConfig", () => {
  // test
  // .stdout()
  // .hook('init', {id: 'mycommand'})
  // .do(output => expect(output.stdout).to.contain('example hook running mycommand'))
  // .it('shows a message')

  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid saveDir globally", async () => {
      expect(__saveDir).to.equal(global.testUserConfig.path.saveDir);
      const isValid = await saveDirValidation(__saveDir);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid tmpDir globally", async () => {
      expect(__tmpDir).to.equal(global.testUserConfig.path.tmpDir);
      const isValid = await tmpDirValidation(__tmpDir);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid logDir globally", async () => {
      expect(__logDir).to.equal(
        path.join(global.testUserConfig.path.tmpDir, "logs")
      );
      const isValid = await dirValidation(__logDir);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid packedDir globally", async () => {
      expect(__packedDir).to.equal(
        path.join(global.testUserConfig.path.tmpDir, "packed")
      );
      const isValid = await dirValidation(__packedDir);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid unpackedDir globally", async () => {
      expect(__unpackedDir).to.equal(
        path.join(global.testUserConfig.path.tmpDir, "unpacked")
      );
      const isValid = await dirValidation(__unpackedDir);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it("should set correct and valid concurrencyLimit value", async () => {
      expect(__concurrencyLimit).to.equal(
        global.testUserConfig.process.concurrency
      );
      const isValid = await concurrencyValidation(__concurrencyLimit);
      expect(isValid).to.be.true;
    });
  test
    .hook("prerun", { id: "parseUserConfig" })
    .it(
      "should set correct and valid transferProgressTimeout value",
      async () => {
        expect(__transferProgressTimeout).to.equal(
          global.testUserConfig.process.transferProgressTimeout
        );
        const isValid = await transferProgressTimeoutValidation(
          __transferProgressTimeout
        );
        expect(isValid).to.be.true;
      }
    );
});
