const { expect, test } = require("@oclif/test");
const path = require("path");
const defaults = require("../../../src/helperFunctions/userConfig/defaultUserConfig");
const {
  concurrencyValidation,
  transferProgressTimeoutValidation,
} = require("../../../src/helperFunctions/userConfig/validation");

describe("defaultUserConfig", () => {
  context("default saveDir", () => {
    test
      .env({ LOCALAPPDATA: undefined })
      .stub(process, "env.HOME", "/Users/username/")
      .it("should give cities: skylines mac home dir on mac", () => {
        const originalPlatform = Object.getOwnPropertyDescriptor(
          process,
          "platform"
        );
        Object.defineProperty(process, "platform", {
          value: "darwin",
        });
        expect(defaults.saveDir).to.equal(
          path.join(
            "/Users/username/Library/Application Support",
            "/Colossal Order/Cities_Skylines/"
          )
        );
        Object.defineProperty(process, "platform", originalPlatform);
      });

    test
      .env({ LOCALAPPDATA: undefined })
      .stub(process, "platform", "linux")
      .stub(process, "env.HOME", "/Users/username/")
      .it("should give cities: skylines linux home dir on linux", () => {
        const originalPlatform = Object.getOwnPropertyDescriptor(
          process,
          "platform"
        );
        Object.defineProperty(process, "platform", {
          value: "linux",
        });
        expect(defaults.saveDir).to.equal(
          path.join(
            "/Users/username/.local/share",
            "/Colossal Order/Cities_Skylines/"
          )
        );
        Object.defineProperty(process, "platform", originalPlatform);
      });

    test
      .stub(process, "env.LOCALAPPDATA", "C:\\Users\\user\\AppData\\Roaming")
      .it("should give cities: skylines windows home dir on windows", () => {
        const originalPlatform = Object.getOwnPropertyDescriptor(
          process,
          "platform"
        );
        Object.defineProperty(process, "platform", {
          value: "win32",
        });
        expect(defaults.saveDir).to.equal(
          path.join(
            "C:\\Users\\user\\AppData\\Roaming",
            "/Colossal Order/Cities_Skylines/"
          )
        );
        Object.defineProperty(process, "platform", originalPlatform);
      });
  });

  context("defualt tmpDir", () => {
    test.it("should equal ./tmp from root of package", () => {
      expect(defaults.tmpDir).to.equal(path.join(__dirname, "../../../tmp"));
    });
  });

  context("default concurrency", () => {
    test.it("should equal a valid concurrency value", async () => {
      expect(await concurrencyValidation(defaults.concurrency)).to.be.true;
    });
  });

  context("default transferProgressTimeout", () => {
    test.it("should equal a valid transferProgressTimeout value", async () => {
      expect(
        await transferProgressTimeoutValidation(
          defaults.transferProgressTimeout
        )
      ).to.be.true;
    });
  });
});
