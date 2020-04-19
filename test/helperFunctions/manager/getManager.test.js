const { expect, test } = require("@oclif/test");
const getManager = require("../../../src/helperFunctions/manager/getManager");
const fs = require("fs-extra");
const path = require("path");

describe("getManager", () => {
  before(async () => {
    this.managerPath = path.join(
      global.testUserConfig.path.saveDir,
      "manager.json"
    );
    await fs.ensureFile(this.managerPath);
  });

  let sampleManagerData = {
    name: "CSMM_DEFAULT",
    description: "",
    installed: {
      "406354745": {
        title: "Speed Slider [v2]",
        updated: "2017-09-16T06:18:00.000Z",
        location:
          "/Users/saksham/Library/Application Support/Colossal Order/Cities_Skylines/Addons/Mods/406354745",
        id: "406354745",
      },
      "412146081": {
        title: "PostProcessFX v1.9.0",
        updated: "2017-11-17T06:21:00.000Z",
        location:
          "/Users/saksham/Library/Application Support/Colossal Order/Cities_Skylines/Addons/Mods/412146081",
        id: "412146081",
      },
    },
  };

  test
    .do(async () => {
      await fs.remove(this.managerPath);
    })
    .it(
      "should make a fresh and valid manager.json if doesn't exist",
      async () => {
        const manager = await getManager();
        expect(manager.get("name")).to.equal("CSMM_DEFAULT");
        expect(manager.get("description")).to.equal("");
        expect(manager.get("installed")).to.deep.equal({});
      }
    );

  test
    .do(async () => {
      await fs.writeFile(this.managerPath, "");
    })
    .it(
      "should make a fresh and valid manager.json if empty manager file",
      async () => {
        const manager = await getManager();
        expect(manager.get("name")).to.equal("CSMM_DEFAULT");
        expect(manager.get("description")).to.equal("");
        expect(manager.get("installed")).to.deep.equal({});
      }
    );

  test
    .do(async () => {
      await fs.writeFile(this.managerPath, JSON.stringify(sampleManagerData));
    })
    .it(
      "should fetch information if manager.json contains valid data",
      async () => {
        const manager = await getManager();
        expect(manager.get("name")).to.equal(sampleManagerData.name);
        expect(manager.get("description")).to.equal(
          sampleManagerData.description
        );
        expect(manager.get("installed")).to.deep.equal(
          sampleManagerData.installed
        );
      }
    );

  test
    .do(async () => {
      const editedSampleManagerData = { ...sampleManagerData };
      editedSampleManagerData.installed["406354745"].id = "asdfnjl";
      await fs.writeFile(this.managerPath, JSON.stringify(sampleManagerData));
    })
    .it(
      "should reset manager.json if data doesn't follow schema (manual changes to manager.json)",
      async () => {
        const manager = await getManager();
        expect(manager.get("name")).to.equal("CSMM_DEFAULT");
        expect(manager.get("description")).to.equal("");
        expect(manager.get("installed")).to.deep.equal({});
      }
    );
});
