const { expect, test } = require("@oclif/test");
const fs = require("fs-extra");
const path = require("path");
const getManager = require("../../src/helperFunctions/manager/getManager");

const ensureItemInstallation = async (id) => {
  const manager = await getManager();
  const installedDetails = manager.get(`installed.${id}`);
  expect(installedDetails.title).to.be.a("string").with.lengthOf.greaterThan(0);
  expect(Date.parse(installedDetails.updated)).to.not.be.NaN;
  expect(installedDetails.location)
    .to.be.a("string")
    .with.lengthOf.greaterThan(0);
  const installPathExists = await fs.pathExists(installedDetails.location);
  expect(installPathExists).to.be.true;
  expect(installedDetails.id).to.be.a("string").and.equal(id);
  const itemJSON = await fs.readJSON(
    path.join(installedDetails.location, "item.json")
  );
  expect(installedDetails.title).to.equal(itemJSON.title);
  expect(installedDetails.id).to.equal(itemJSON.id);
  expect(itemJSON.requirements).to.be.an("array");
  expect(itemJSON.dlcRequirements).to.be.an("array");
  const dir = await fs.promises.opendir(installedDetails.location);
  const fileNames = [];
  for await (const dirent of dir) {
    fileNames.push(dirent.name);
  }
  if (fileNames.length === 1) console.error(fileNames);
  expect(fileNames.length).to.be.greaterThan(1);
};

const testSetup = test.timeout(10000000).stub(console, "log", () => {});

describe("install <steamId>", () => {
  afterEach(async () => {
    await fs.emptyDir(global.testUserConfig.path.saveDir);
  });

  testSetup
    .command(["install", "1625704117"])
    .it(
      "should install single item without dependencies from STEAM",
      async (output) => {
        await ensureItemInstallation("1625704117");
      }
    );

  testSetup
    .command(["install", "1619685021"])
    .it(
      "should install item along with all of its dependencies from STEAM",
      async (output) => {
        await ensureItemInstallation("1619685021");
        await ensureItemInstallation("791221322");
        await ensureItemInstallation("787611845");
        await ensureItemInstallation("593588108");
      }
    );

  testSetup
    .timeout(100000)
    .stdout()
    .command(["install", "409229385"])
    .it("should install complete collection from STEAM", async (output) => {
      await ensureItemInstallation("409226894");
      await ensureItemInstallation("409226468");
      await ensureItemInstallation("409226626");
      await ensureItemInstallation("409225763");
      await ensureItemInstallation("409227208");
      await ensureItemInstallation("409225133");
      await ensureItemInstallation("409226174");
      await ensureItemInstallation("413478165");
      await ensureItemInstallation("415083368");
    });
});

describe("install <steamId> -m SMODS", () => {
  afterEach(async () => {
    await fs.emptyDir(global.testUserConfig.path.saveDir);
  });
  const testSetup = test.timeout(10000000).stub(console, "log", () => {});
  
  testSetup
    .command(["install", "1625704117", "-m", "SMODS"])
    .it(
      "should install single item without dependencies from SMODS",
      async (output) => {
        await ensureItemInstallation("1625704117");
      }
    );
  testSetup
    .command(["install", "1619685021", "-m", "SMODS"])
    .it(
      "should install item along with all of its dependencies from SMODS",
      async (output) => {
        await ensureItemInstallation("1619685021");
        await ensureItemInstallation("791221322");
        await ensureItemInstallation("787611845");
        await ensureItemInstallation("593588108");
      }
    );

  testSetup
    .command(["install", "931499448", "-m", "SMODS"])
    .it("should install complete collection from SMODS", async (output) => {
      await ensureItemInstallation("934935465");
      await ensureItemInstallation("931504006");
      await ensureItemInstallation("931503753");
      await ensureItemInstallation("931862279");
      await ensureItemInstallation("930995839");
      await ensureItemInstallation("931849902");
      await ensureItemInstallation("931566515");
      await ensureItemInstallation("931504190");
    });
});
