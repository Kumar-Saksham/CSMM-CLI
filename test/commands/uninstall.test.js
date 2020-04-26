const { expect, test } = require("@oclif/test");
const fs = require("fs-extra");
const path = require("path");
const getManager = require("../../src/helperFunctions/manager/getManager");

const sampleManagerInstalledData = () => {
  return {
    "593588108": {
      title: "Prop & Tree Anarchy",
      updated: "2017-10-20T08:54:00.000Z",
      location: path.join(
        global.testUserConfig.path.saveDir,
        "Addons/mods",
        "593588108"
      ),
      id: "593588108",
    },
    "445589127": {
      title: "Precision Engineering",
      updated: "2016-03-29T07:04:00.000Z",
      location: path.join(
        global.testUserConfig.path.saveDir,
        "Addons/mods",
        "445589127"
      ),
      id: "445589127",
    },
  };
};

describe("uninstall <steamId>", async () => {
  before(() => {
    this.saveDirBckp = global.__saveDir;
    global.__saveDir = global.testUserConfig.path.saveDir;
  });
  beforeEach(async () => {
    const installedData = sampleManagerInstalledData();
    await fs.writeJSON(
      path.join(global.testUserConfig.path.saveDir, "manager.json"),
      {
        name: "something",
        description: "",
        installed: installedData,
      }
    );
    for (article of Object.values(installedData)) {
      await fs.ensureDir(article.location);
      await fs.writeJSON(path.join(article.location, "mod.dll"), {
        name: "article.title",
      });
    }
  });
  afterEach(async () => {
    await fs.emptyDir(global.testUserConfig.path.saveDir);
  });
  after(() => {
    global.__saveDir = this.saveDirBckp;
  });

  test
    .stdout()
    .do(async () => {
      const manager = await getManager();
      const installedItems = manager.get("installed");
      expect(Object.keys(installedItems).length).to.be.greaterThan(1);
    })
    .command(["uninstall", "593588108"])
    .it("should uninstall only one mod", async (output) => {
      expect(output.stdout.toLowerCase()).to.contain(
        "successfully uninstalled"
      );
      expect(
        await fs.pathExists(sampleManagerInstalledData()["593588108"].location)
      ).to.be.false;
      expect(
        await fs.pathExists(
          path.join(
            sampleManagerInstalledData()["593588108"].location,
            "mod.dll"
          )
        )
      ).to.be.false;
      const manager = await getManager();
      expect(manager.get("installed.593588108")).to.be.undefined;
      const installedItems = manager.get("installed");
      const installedItemList = Object.values(installedItems);
      expect(installedItemList.length).to.equal(1);
    });
});

describe("uninstall", async () => {
  before(() => {
    this.saveDirBckp = global.__saveDir;
    global.__saveDir = global.testUserConfig.path.saveDir;
  });
  beforeEach(async () => {
    const installedData = sampleManagerInstalledData();
    await fs.writeJSON(
      path.join(global.testUserConfig.path.saveDir, "manager.json"),
      {
        name: "something",
        description: "",
        installed: installedData,
      }
    );
    for (article of Object.values(installedData)) {
      await fs.ensureDir(article.location);
      await fs.writeJSON(path.join(article.location, "mod.dll"), {
        name: "article.title",
      });
    }
  });
  afterEach(async () => {
    await fs.emptyDir(global.testUserConfig.path.saveDir);
  });
  after(() => {
    global.__saveDir = this.saveDirBckp;
  });
});
