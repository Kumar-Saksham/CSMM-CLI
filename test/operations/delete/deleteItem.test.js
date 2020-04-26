const { test, expect } = require("@oclif/test");
const fs = require("fs-extra");
const deleteItem = require("../../../src/operations/delete/deleteItem");
const getManager = require("../../../src/helperFunctions/manager/getManager");

describe("deleteItem", () => {
  beforeEach(async () => {
    const manager = await getManager();
    manager.set("installed", {
      "123456": {
        title: "titleOf123456",
        location: "location/Of/123456",
        updated: new Date().toISOString(),
        id: "123456",
      },
    });
  });

  test
    .stub(fs, "remove", (loc) => {
      this.loc = loc;
      return Promise.resolve();
    })
    .it("should delete item with given id", async () => {
      const nameOfDeletedItem = await deleteItem("123456");
      expect(nameOfDeletedItem).to.equal("titleOf123456");
      expect(this.loc).to.equal("location/Of/123456");
    });

  test
    .do(async () => {
      const nameOfDeletedItem = await deleteItem("654321");
    })
    .catch(/.*/g)
    .it("should throw error on id of item not installed");
});
