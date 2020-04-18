const { expect, test } = require("@oclif/test");
const getLinkSmods = require("../../../src/operations/download/getLinkSmods");

describe("getLinkSmods", () => {
  test
    .timeout(1000000)
    .it("should get file download link for mod", async () => {
      const link = await getLinkSmods("1625704117");
      expect(link).to.contain(".zip").and.contain("file").and.contain("1625704117");
    });
});
