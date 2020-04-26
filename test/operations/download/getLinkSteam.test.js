const { expect, test } = require("@oclif/test");
const getLinkSteam = require("../../../src/operations/download/getLinkSteam");

describe("getLinkSteam", () => {
  test
    .timeout(1000000)
    .it("should get file download link for mod", async () => {
      const link = await getLinkSteam("1625704117");
      expect(link).to.contain(".zip").and.contain("1625704117");
    });
});
