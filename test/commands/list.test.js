const { expect, test } = require("@oclif/test");

const getManager = require("../../src/helperFunctions/manager/getManager");

describe("list", () => {
  before(async () => {
    this.testManager = await getManager();
    this.managerStoreBackup = this.testManager.store;
  });

  after(() => {
    this.testManager.store = this.managerStoreBackup;
  });

  test
    .do(() => (this.testManager.setStore = {}))
    .stdout()
    .command(["list"])
    .it("should show no mods installed if manager is empty", (ctx) => {
      expect(ctx.stdout).to.contain("No mods installed");
    });

  test
    .do(() =>
      this.testManager.set("installed", {
        "406354745": {
          title: "Speed Slider [v2]",
          updated: "2017-09-16T06:18:00.000Z",
          location:
            "/Users/username/Library/Application Support/Colossal Order/Cities_Skylines/Addons/Mods/406354745",
          id: "406354745",
        },
        "412146081": {
          title: "PostProcessFX v1.9.0",
          updated: "2017-11-17T06:21:00.000Z",
          location:
            "/Users/username/Library/Application Support/Colossal Order/Cities_Skylines/Addons/Mods/412146081",
          id: "412146081",
        },
      })
    )
    .stdout()
    .command(["list"])
    .it("should show installed mods details", (ctx) => {
      expect(ctx.stdout)
        .to.contain("Speed Slider [v2]")
        .and.contain("406354745")
        .and.contain("PostProcessFX v1.9.0")
        .and.contain("412146081");
    });
});
