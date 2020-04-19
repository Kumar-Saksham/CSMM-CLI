const { test, expect } = require("@oclif/test");
const getMetadata = require("../../../src/operations/getMetadata/getMetadata");

describe("getMetadata", () => {
  before(() => {
    global.__edit = false;
  });
  this.verifyItem = (singleItem, id) => {
    expect(singleItem.title.toLowerCase())
      .to.be.a("string")
      .and.have.lengthOf.greaterThan(0);
    expect(singleItem.categories[0].toLowerCase())
      .to.be.a("string")
      .and.have.lengthOf.greaterThan(0);
    expect(singleItem.author.toLowerCase())
      .to.be.a("string")
      .and.have.lengthOf.greaterThan(0);
    expect(singleItem.posted)
      .to.be.a("string")
      .and.have.lengthOf.greaterThan(0);
    expect(singleItem.updated)
      .to.be.a("string")
      .and.have.lengthOf.greaterThan(0);
    expect(singleItem.requirements).to.be.an("array");
    expect(singleItem.dlcRequirements).to.be.an("array");
    expect(singleItem.id).to.equal(id);
    expect(Date.parse(singleItem.posted)).to.not.be.NaN;
    expect(Date.parse(singleItem.updated)).to.not.be.NaN;
  };

  const testSetup = test.timeout(10000000).stub(console, "log", () => {});

  testSetup
    .do(async () => {
      const metas = await getMetadata("2060661421");
    })
    .catch(/cities: skylines/i)
    .it("should throw error if mod is not for cities: skylines");

  testSetup
    .do(async () => {
      const metas = await getMetadata("1232123432342345678");
    })
    .catch(/found/i)
    .it("should throw error if invalid or non-existsing id");

  testSetup.it(
    "should get metadata for single item w/o dependency",
    async () => {
      const metadatas = await getMetadata("1625704117");
      const singleItem = metadatas["1625704117"];
      this.verifyItem(singleItem, "1625704117");
    }
  );

  testSetup.it("should get metadata for item w/ dependencies", async () => {
    const metadatas = await getMetadata("1619685021");
    expect(metadatas).to.be.an("object");
    const itemIDs = Object.keys(metadatas);
    expect(itemIDs.length).to.be.greaterThan(1);
    for (id of itemIDs) {
      this.verifyItem(metadatas[id], id);
    }
  });

  testSetup.it("should get metadata for whole collection", async () => {
    const metadatas = await getMetadata("409229385");
    expect(metadatas).to.be.a("object");
    const collectionItems = Object.keys(metadatas);
    expect(collectionItems.length).to.be.greaterThan(1);
    for (itemId of collectionItems) {
      this.verifyItem(metadatas[itemId], itemId);
    }
  });
});
