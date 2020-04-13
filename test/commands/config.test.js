const { expect, test } = require("@oclif/test");
const path = require("path");

describe("config <property>", () => {
  test
    .stdout()
    .command(["config", "saveDir"])
    .it("should fetch saveDir", (ctx) => {
      expect(ctx.stdout).to.contain(global.testUserConfig.path.saveDir);
    });

  test
    .stdout()
    .command(["config", "tmpDir"])
    .it("should fetch tmpDir", (ctx) => {
      expect(ctx.stdout).to.contain(global.testUserConfig.path.tmpDir);
    });
  test
    .stdout()
    .command(["config", "concurrency"])
    .it("should fetch concurrency value", (ctx) => {
      expect(ctx.stdout).to.contain(global.testUserConfig.process.concurrency);
    });
  test
    .stdout()
    .command(["config", "transferProgressTimeout"])
    .it("should fetch transferProgressTimeout value", (ctx) => {
      expect(ctx.stdout).to.contain(
        global.testUserConfig.process.transferProgressTimeout
      );
    });

  test
    .stdout()
    .command(["config", "akljffjklds"])
    .exit(2)
    .it("should exit without output for invalid property", (ctx) => {
      expect(ctx.stdout).to.equal("");
    });
});

describe("config <property> <value>", () => {
  afterEach(() => {
    global.userConfig.store = global.testUserConfig;
  });

  test
    .stdout()
    .command(["config", "saveDir", __dirname])
    .it("should set saveDir to any valid directory path", (ctx) => {
      expect(global.userConfig.get("path.saveDir")).to.equal(__dirname);
      expect(ctx.stdout).to.contain(__dirname);
    });

  test
    .stdout()
    .command(["config", "saveDir", "sampleRandomSample"])
    .command(["config", "saveDir", "3423423423"])
    .command(["config", "saveDir", "%HOME%"])
    .it("should not set saveDir to any invalid input", (ctx) => {
      expect(global.userConfig.get("path.saveDir")).to.equal(
        global.testUserConfig.path.saveDir
      );
      expect(ctx.stdout).to.not.contain("saveDir set to:");
    });

  test
    .stdout()
    .command(["config", "saveDir", path.join(__dirname, "testSample_1234")])
    .it("should not set saveDir to any non-existsing directory path", (ctx) => {
      expect(global.userConfig.get("path.saveDir")).to.equal(
        global.testUserConfig.path.saveDir
      );
      expect(ctx.stdout).to.contain("Invalid input for saveDir");
    });

  test
    .stdout()
    .command(["config", "tmpDir", __dirname])
    .it("should set tmpDir to any valid directory path", (ctx) => {
      expect(global.userConfig.get("path.tmpDir")).to.equal(__dirname);
      expect(ctx.stdout).to.contain(__dirname);
    });

  test
    .stdout()
    .command(["config", "tmpDir", "sampleRandomSample"])
    .command(["config", "tmpDir", "3423423423"])
    .command(["config", "tmpDir", "%HOME%"])
    .it("should not set tmpDir to any invalid input", (ctx) => {
      expect(global.userConfig.get("path.tmpDir")).to.equal(
        global.testUserConfig.path.tmpDir
      );
      expect(ctx.stdout).to.not.contain("tmpDir set to:");
    });

  test
    .stdout()
    .command(["config", "tmpDir", path.join(__dirname, "testSample_1234")])
    .it("should not set tmpDir to any non-existsing directory path", (ctx) => {
      expect(global.userConfig.get("path.tmpDir")).to.equal(
        global.testUserConfig.path.tmpDir
      );
      expect(ctx.stdout).to.contain("Invalid input for tmpDir");
    });

  test
    .stdout()
    .command(["config", "concurrency", "6"])
    .command(["config", "concurrency", "2"])
    .command(["config", "concurrency", "1"])
    .command(["config", "concurrency", "4"])
    .command(["config", "concurrency", "5"])
    .command(["config", "concurrency", "3"])
    .it(
      "should set concurrency value to integer between 1 and 6 inclusive",
      (ctx) => {
        expect(global.userConfig.get("process.concurrency")).to.equal(3);
        expect(ctx.stdout).to.not.contain("Invalid input for concurrency");
      }
    );

  test
    .stdout()
    .command(["config", "concurrency", "6.123"])
    .command(["config", "concurrency", "2.123"])
    .command(["config", "concurrency", "1.001"])
    .command(["config", "concurrency", "4.121"])
    .command(["config", "concurrency", "5.999"])
    .command(["config", "concurrency", "3.9999"])
    .it(
      "should set concurrency value to integer part if float between 1 and 6 inclusive",
      (ctx) => {
        expect(global.userConfig.get("process.concurrency")).to.equal(3);
        expect(ctx.stdout).to.not.contain("Invalid input for concurrency");
      }
    );

  test
    .stdout()
    .command(["config", "concurrency", "-1"])
    .command(["config", "concurrency", "0"])
    .command(["config", "concurrency", "7"])
    .command(["config", "concurrency", "10"])
    .command(["config", "concurrency", "0.123"])
    .command(["config", "concurrency", "10.123"])
    .it(
      "should not set concurrency value to integer outside 1-6 range",
      (ctx) => {
        expect(global.userConfig.get("process.concurrency")).to.equal(
          global.testUserConfig.process.concurrency
        );
        expect(ctx.stdout).to.not.contain("concurrency set to:");
      }
    );

  test
    .stdout()
    .command(["config", "concurrency", "testSample_123"])
    .command(["config", "concurrency", "undefined"])
    .command(["config", "concurrency", "12abc"])
    .command(["config", "concurrency", "2.324.2342"])
    .it("should not set concurrency value to non integer values", (ctx) => {
      expect(global.userConfig.get("process.concurrency")).to.equal(
        global.testUserConfig.process.concurrency
      );
      expect(ctx.stdout).to.not.contain("concurrency set to:");
    });

  test
    .stdout()
    .command(["config", "transferProgressTimeout", "5000"])
    .command(["config", "transferProgressTimeout", "15000"])
    .command(["config", "transferProgressTimeout", "150000"])
    .it(
      "should set transferProgressTimeout to integer greater than 5000",
      (ctx) => {
        expect(
          global.userConfig.get("process.transferProgressTimeout")
        ).to.equal(150000);
        expect(ctx.stdout).to.not.contain(
          "Invalid input for transferProgressTimeout"
        );
      }
    );

  test
    .stdout()
    .command(["config", "transferProgressTimeout", "5000.123"])
    .command(["config", "transferProgressTimeout", "15000.123"])
    .command(["config", "transferProgressTimeout", "150000.999"])
    .it(
      "should set transferProgressTimeout value to integer part if float, greater than 5000",
      (ctx) => {
        expect(
          global.userConfig.get("process.transferProgressTimeout")
        ).to.equal(150000);
        expect(ctx.stdout).to.not.contain(
          "Invalid input for transferProgressTimeout"
        );
      }
    );

  test
    .stdout()
    .command(["config", "transferProgressTimeout", "-1"])
    .command(["config", "transferProgressTimeout", "0"])
    .command(["config", "transferProgressTimeout", "7"])
    .command(["config", "transferProgressTimeout", "10"])
    .command(["config", "transferProgressTimeout", "4999.999"])
    .command(["config", "transferProgressTimeout", "1000.123"])
    .it(
      "should not set transferProgressTimeout value to integer lower than 5000",
      (ctx) => {
        expect(
          global.userConfig.get("process.transferProgressTimeout")
        ).to.equal(global.testUserConfig.process.transferProgressTimeout);
        expect(ctx.stdout).to.not.contain("transferProgressTimeout set to:");
      }
    );

  test
    .stdout()
    .command(["config", "transferProgressTimeout", "testSample_123"])
    .command(["config", "transferProgressTimeout", "undefined"])
    .command(["config", "transferProgressTimeout", "12000abc"])
    .command(["config", "transferProgressTimeout", "20000.324.2342"])
    .it(
      "should not set transferProgressTimeout value to non integer values",
      (ctx) => {
        expect(
          global.userConfig.get("process.transferProgressTimeout")
        ).to.equal(global.testUserConfig.process.transferProgressTimeout);
        expect(ctx.stdout).to.not.contain("transferProgressTimeout set to:");
      }
    );
});
