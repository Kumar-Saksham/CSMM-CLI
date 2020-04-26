const { expect, test } = require("@oclif/test");
const Zip = require("adm-zip");
const fs = require("fs-extra");
const path = require("path");
const unpack = require("../../../src/operations/install/unpack");
const sinon = require("sinon");

describe("unpack", () => {
  before(async () => {
    this.unpackedDir = path.join(
      global.userConfig.get("path.tmpDir"),
      "unpacked"
    );
    this.steamSource = path.join(__dirname, "./testFiles/testSTEAM.zip");
    this.smodsSource = path.join(__dirname, "./testFiles/testSMODS.zip");
    this.destination = this.unpackedDir;
    await fs.emptyDir(this.unpackedDir);
  });

  afterEach(async () => {
    await fs.emptyDir(this.unpackedDir);
  });

  test.it("should extract SMODS zip correctly", async () => {
    const outputFolder = await unpack(this.smodsSource, this.destination);
    const expectedOutputFoler = path.join(
      this.destination,
      "2055465280 Extended Error Reporting"
    );
    const expectedOutputFile = path.join(expectedOutputFoler, "HealkitMod.dll");
    expect(outputFolder).to.equal(expectedOutputFoler);
    expect(await fs.pathExists(expectedOutputFoler)).to.be.true;
    expect(await fs.pathExists(expectedOutputFile)).to.be.true;
  });

  test.it("should extract STEAM zip correctly", async () => {
    const outputFolder = await unpack(this.steamSource, this.destination);
    const expectedOutputFoler = path.join(this.destination, "2055465280");
    const expectedOutputFile = path.join(expectedOutputFoler, "HealkitMod.dll");
    expect(outputFolder).to.equal(expectedOutputFoler);
    expect(await fs.pathExists(expectedOutputFoler)).to.be.true;
    expect(await fs.pathExists(expectedOutputFile)).to.be.true;
  });

  test
    .do(async () => {
      const outputFolder = await unpack("testString123", this.destination);
    })
    .catch(/source is not absolute/i)
    .do(async () => {
      const outputFolder = await unpack("/testString123", this.destination);
    })
    .catch(/source: ENOENT/i)
    .do(async () => {
      const outputFolder = await unpack(__dirname, this.destination);
    })
    .catch(/source: not a file/i)
    .it("should throw error if source is not valid existing file path");

  test
    .do(async () => {
      const outputFolder = await unpack(this.steamSource, "destination");
    })
    .catch(/destination is not absolute/i)
    .it("should throw error if destination is not valid absolute path");

  test
    .do(async () => {
      const outputFolder = await unpack(
        this.steamSource,
        path.join(this.destination, "thisShouldBeDeletedLater")
      );
    })
    .catch("", { raiseIfNotThrown: false })
    .it(
      "should not throw error if destination is non-existing valid absolute path"
    );
});
