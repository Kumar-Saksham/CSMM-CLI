const { expect, test } = require("@oclif/test");
const validations = require("../../../src/helperFunctions/userConfig/validation");
const path = require("path");

describe("User config validations", () => {
  context("integer validation", () => {
    test.it("should return true for integers", () => {
      expect(validations.integerValidation(23)).to.be.true;
      expect(validations.integerValidation(2989)).to.be.true;
      expect(validations.integerValidation(1000000000)).to.be.true;
      expect(validations.integerValidation(-5000000)).to.be.true;
    });

    test.it("should return false for floats or doubles", () => {
      expect(validations.integerValidation("23.2231")).to.be.false;
      expect(validations.integerValidation("2989.111")).to.be.false;
      expect(validations.integerValidation("1000000000.000000000001")).to.be
        .false;
      expect(validations.integerValidation("-5000000.123")).to.be.false;
    });

    test.it("should return false for strings of integers", () => {
      expect(validations.integerValidation("23")).to.be.false;
      expect(validations.integerValidation("2989")).to.be.false;
      expect(validations.integerValidation("1000000000")).to.be.false;
      expect(validations.integerValidation("-5000000")).to.be.false;
    });

    test.it("should return false for non integer data", () => {
      expect(validations.integerValidation("23")).to.be.false;
      expect(validations.integerValidation("abcdefg")).to.be.false;
      expect(validations.integerValidation({})).to.be.false;
      expect(validations.integerValidation(true)).to.be.false;
      expect(validations.integerValidation(false)).to.be.false;
      expect(validations.integerValidation(() => {})).to.be.false;
      expect(validations.integerValidation(NaN)).to.be.false;
      expect(validations.integerValidation(undefined)).to.be.false;
    });
  });

  context("directory validation", () => {
    test.it(
      "should return true for a valid and existing directory path",
      async () => {
        expect(await validations.dirValidation(__dirname)).to.be.true;
        expect(await validations.dirValidation(process.cwd())).to.be.true;
        expect(
          await validations.dirValidation(global.testUserConfig.path.saveDir)
        ).to.be.true;
      }
    );

    test.it(
      "should return false for a valid but non-existing directory path",
      async () => {
        expect(
          await validations.dirValidation(path.join(__dirname, "testsample123"))
        ).to.be.false;
        expect(
          await validations.dirValidation(
            path.join(process.cwd(), "..", "testsample123")
          )
        ).to.be.false;
        expect(
          await validations.dirValidation(
            path.join(global.testUserConfig.path.saveDir, "testsample123")
          )
        ).to.be.false;
      }
    );

    test.it("should return false for relative directory path", async () => {
      expect(await validations.dirValidation("./src")).to.be.false;
      expect(await validations.dirValidation("./test/commands")).to.be.false;
      expect(await validations.dirValidation("./package.json")).to.be.false;
    });

    test.it("should return false for file path", async () => {
      expect(await validations.dirValidation(__filename)).to.be.false;
      expect(await validations.dirValidation("./package.json")).to.be.false;
    });
  });

  context("saveDir validation", () => {
    test.it("should pass all directory validation tests", async () => {
      expect(await validations.saveDirValidation(__dirname)).to.be.true;
      expect(await validations.saveDirValidation(process.cwd())).to.be.true;
      expect(
        await validations.saveDirValidation(global.testUserConfig.path.saveDir)
      ).to.be.true;
      expect(
        await validations.saveDirValidation(
          path.join(__dirname, "testsample123")
        )
      ).to.be.false;
      expect(
        await validations.saveDirValidation(
          path.join(process.cwd(), "..", "testsample123")
        )
      ).to.be.false;
      expect(
        await validations.saveDirValidation(
          path.join(global.testUserConfig.path.saveDir, "testsample123")
        )
      ).to.be.false;
      expect(await validations.saveDirValidation("./src")).to.be.false;
      expect(await validations.saveDirValidation("./test/commands")).to.be
        .false;
      expect(await validations.saveDirValidation("./package.json")).to.be.false;
      expect(await validations.saveDirValidation(__filename)).to.be.false;
      expect(await validations.saveDirValidation("./package.json")).to.be.false;
    });
  });

  context("tmpDir validation", () => {
    test.it("should pass all directory validation tests", async () => {
      expect(await validations.tmpDirValidation(__dirname)).to.be.true;
      expect(await validations.tmpDirValidation(process.cwd())).to.be.true;
      expect(
        await validations.tmpDirValidation(global.testUserConfig.path.saveDir)
      ).to.be.true;
      expect(
        await validations.tmpDirValidation(
          path.join(__dirname, "testsample123")
        )
      ).to.be.false;
      expect(
        await validations.tmpDirValidation(
          path.join(process.cwd(), "..", "testsample123")
        )
      ).to.be.false;
      expect(
        await validations.tmpDirValidation(
          path.join(global.testUserConfig.path.saveDir, "testsample123")
        )
      ).to.be.false;
      expect(await validations.tmpDirValidation("./src")).to.be.false;
      expect(await validations.tmpDirValidation("./test/commands")).to.be.false;
      expect(await validations.tmpDirValidation("./package.json")).to.be.false;
      expect(await validations.tmpDirValidation(__filename)).to.be.false;
      expect(await validations.tmpDirValidation("./package.json")).to.be.false;
    });
  });

  context("concurrency validation", () => {
    test.it("should reject all non integer values", async () => {
      expect(await validations.concurrencyValidation("23.2231")).to.be.false;
      expect(await validations.concurrencyValidation("2989.111")).to.be.false;
      expect(await validations.concurrencyValidation("1000000000.000000000001"))
        .to.be.false;
      expect(await validations.concurrencyValidation("-5000000.123")).to.be
        .false;
      expect(await validations.concurrencyValidation("23")).to.be.false;
      expect(await validations.concurrencyValidation("2989")).to.be.false;
      expect(await validations.concurrencyValidation("1000000000")).to.be.false;
      expect(await validations.concurrencyValidation("-5000000")).to.be.false;
      expect(await validations.concurrencyValidation("23")).to.be.false;
      expect(await validations.concurrencyValidation("abcdefg")).to.be.false;
      expect(await validations.concurrencyValidation({})).to.be.false;
      expect(await validations.concurrencyValidation(true)).to.be.false;
      expect(await validations.concurrencyValidation(false)).to.be.false;
      expect(await validations.concurrencyValidation(() => {})).to.be.false;
      expect(await validations.concurrencyValidation(NaN)).to.be.false;
      expect(await validations.concurrencyValidation(undefined)).to.be.false;
    });

    test.it("should accept integer values in range 1-6", async () => {
      for (let i = 1; i <= 6; i++) {
        expect(await validations.concurrencyValidation(i)).to.be.true;
      }
    });

    test.it("should return false for values out of range 1 - 6", async () => {
      expect(await validations.concurrencyValidation(-10)).to.be.false;
      expect(await validations.concurrencyValidation(30)).to.be.false;
      expect(await validations.concurrencyValidation(0)).to.be.false;
      expect(await validations.concurrencyValidation(30)).to.be.false;
    });
  });

  context("transferProgressTimeout validation", async () => {
    test.it("should reject all non integer", async () => {
      expect(await validations.transferProgressTimeoutValidation("23.2231")).to
        .be.false;
      expect(await validations.transferProgressTimeoutValidation("2989.111")).to
        .be.false;
      expect(
        await validations.transferProgressTimeoutValidation(
          "1000000000.000000000001"
        )
      ).to.be.false;
      expect(
        await validations.transferProgressTimeoutValidation("-5000000.123")
      ).to.be.false;
      expect(await validations.transferProgressTimeoutValidation("23")).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation("2989")).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation("1000000000"))
        .to.be.false;
      expect(await validations.transferProgressTimeoutValidation("-5000000")).to
        .be.false;
      expect(await validations.transferProgressTimeoutValidation("23")).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation("abcdefg")).to
        .be.false;
      expect(await validations.transferProgressTimeoutValidation({})).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation(true)).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation(false)).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation(() => {})).to
        .be.false;
      expect(await validations.transferProgressTimeoutValidation(NaN)).to.be
        .false;
      expect(await validations.transferProgressTimeoutValidation(undefined)).to
        .be.false;
    });

    test.it("should return true for all integer values >= 5000", async () => {
      for (let i = 5000; i <= 10000; i += 723) {
        expect(await validations.transferProgressTimeoutValidation(i)).to.be
          .true;
      }
    });

    test.it("should return false for all integer values < 5000", async () => {
      for (let i = 4999; i >= 0; i -= 371) {
        expect(await validations.transferProgressTimeoutValidation(i)).to.be
          .false;
      }
    });
  });
});
