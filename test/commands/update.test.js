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
      updated: "2015-03-29T07:04:00.000Z",
      get location() {
        return path.join(
          global.testUserConfig.path.saveDir,
          "Addons/mods",
          this.id
        );
      },
      id: "445589127",
    },
    "837734529": {
      title: "Find It!",
      updated: "2013-06-10T01:46:00.000Z",
      get location() {
        return path.join(
          global.testUserConfig.path.saveDir,
          "Addons/mods",
          this.id
        );
      },
      id: "837734529",
    },
    "1844442251": {
      title: "Fine Road Tool 2.0.4",
      updated: "2018-03-31T01:19:00.000Z",
      get location() {
        return path.join(
          global.testUserConfig.path.saveDir,
          "Addons/mods",
          this.id
        );
      },
      id: "1844442251",
    },
  };
};

describe("update", () => {
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
    .timeout(100000)
    .stub(console, "log", () => {})
    .do(async () => {
      const manager = await getManager();
      const installedItems = manager.get("installed");
      const sampleItems = Object.values(sampleManagerInstalledData());
      expect(Object.keys(installedItems).length).to.be.equal(
        sampleItems.length
      );
      this.previousDates = {};

      for (item of sampleItems) {
        this.previousDates[item.id] = item.updated;
      }
    })
    .command(["update"])
    .it("should update all outdated mods", async () => {
      const manager = await getManager();
      const installedItems = Object.values(manager.get("installed"));
      const updatedDates = {};
      for (item of installedItems) {
        updatedDates[item.id] = item.updated;
      }

      let updateCount = 0;
      for (id of Object.keys(this.previousDates)) {
        updateCount =
          updateCount +
          (new Date(updatedDates[id]) - new Date(this.previousDates[id]) > 0
            ? 1
            : 0);
      }

      expect(updateCount).to.equal(3);
    });
});
