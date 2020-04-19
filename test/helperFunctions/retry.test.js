const { expect, test } = require("@oclif/test");
const retry = require("../../src/helperFunctions/retry");

describe("retry", () => {
  test
    .do(async () => await retry())
    .catch("Missing unsafe function")
    .it("should give error on missing unsafeFunction");

  test
    .do(
      async () =>
        await retry(() => {
          throw new Error("error thrown");
        })
    )
    .catch("", { raiseIfNotThrown: false })
    .it("should not throw error if args are missing except first (unsafe)");

  test
    .stdout()
    .do(async () => {
      const failingFunc = () => {
        console.log("fail");
        throw new Error("fail");
      };
      const catchFunc = () => {
        console.log("catch");
      };
      const doomedFunc = () => {
        console.log("doom");
      };
      const forceExit = () => {
        console.log("forceExit");
      };

      await retry(failingFunc, catchFunc, doomedFunc, forceExit, 1);
    })
    .it("should follow proper pattern on fail", (output) => {
      expect(output.stdout).to.equal("forceExit\nfail\ncatch\ndoom\n");
    });

  test
    .stdout()
    .do(async () => {
      const failingFunc = () => {
        console.log("fail");
      };
      const catchFunc = () => {
        console.log("catch");
      };
      const doomedFunc = () => {
        console.log("doom");
      };
      const forceExit = () => {
        console.log("forceExit");
      };

      await retry(failingFunc, catchFunc, doomedFunc, forceExit, 1);
    })
    .it("should follow proper pattern on success", (output) => {
      expect(output.stdout).to.equal("forceExit\nfail\n");
    });

  test
    .stdout()
    .do(async () => {
      let retries = 0;
      const failingFunc = () => {
        console.log("fail");
        if (retries < 2) throw new Error("error");
      };
      const catchFunc = () => {
        retries++;
        console.log("catch");
      };
      const doomedFunc = () => {
        console.log("doom");
      };
      const forceExit = () => {
        console.log("forceExit");
      };
      await retry(failingFunc, catchFunc, doomedFunc, forceExit, 3);
    })
    .it("should follow proper pattern on success after fail", (output) => {
      expect(output.stdout).to.equal(
        "forceExit\nfail\ncatch\nforceExit\nfail\ncatch\nforceExit\nfail\n"
      );
    });

  test
    .stdout()
    .do(async () => {
      const failingFunc = () => {
        console.log("fail");
        throw new Error("error");
      };
      const catchFunc = () => {
        console.log("catch");
      };
      const doomedFunc = () => {
        console.log("doom");
      };
      const forceExit = () => {
        console.log("forceExit");
      };
      await retry(failingFunc, catchFunc, doomedFunc, forceExit);
    })
    .it("should exit after n default retries", (output) => {
      expect(output.stdout).to.contain("doom");
    });
});
