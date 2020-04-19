const { test, expect } = require("@oclif/test");
const sinon = require("sinon");
const rewiremock = require("rewiremock/node");
const path = require("path");
const fs = require("fs-extra");

describe("install", () => {
  const sampleArticle = {
    title: "Article Title",
    updated: new Date().toISOString(),
    id: "1234567890",
    categories: ["Mod"],
  };

  const locations = {
    relativeCatPath: "./relative/path/of/category",
    rootDirInZip: "/zipRootDir",
    unpackDir: "/this/is/the/unpackedDir/",
    saveDir: "/this/is/the/saveDir/",
    downloadedZipFilePath: "/downloaded/file/path/file.zip",
    get unpackedZipDir() {
      return path.join(locations.unpackDir, locations.rootDirInZip);
    },
    get itemJSON() {
      return path.join(locations.unpackedZipDir, "item.json");
    },
    get installPath() {
      return path.join(
        locations.saveDir,
        locations.relativeCatPath,
        sampleArticle.id
      );
    },
  };

  const unpackMock = sinon.spy((source, dest) =>
    path.join(dest, locations.rootDirInZip)
  );
  const relativePathOfMock = sinon.spy(() => locations.relativeCatPath);
  const fsExtraMock = {
    move: sinon.spy(),
    ensureFile: sinon.spy(),
    writeJSON: sinon.spy(),
  };
  const getManagerMock = sinon.spy(() => {
    return {
      get: () => {
        {
        }
      },
      set: (installObj) => {
        this.finalInstalledObject = installObj;
      },
    };
  });

  let setStubs = test
    .stub(global, "__unpackedDir", locations.unpackDir)
    .stub(global, "__saveDir", locations.saveDir);

  before(() => {
    rewiremock("../../../src/helperFunctions/manager/getManager").with(
      getManagerMock
    );
    rewiremock("../../../src/operations/install/unpack").with(unpackMock);
    rewiremock("../../../src/operations/install/categoryLocation").with(
      relativePathOfMock
    );
    rewiremock("fs-extra").with(fsExtraMock);
  });

  afterEach(async () => {
    await fs.emptyDir(global.testUserConfig.path.saveDir);
  });

  setStubs.it("should follow proper pattern of installation", async () => {
    rewiremock.enable();
    const install = require("../../../src/operations/install/install");
    await install(sampleArticle, locations.downloadedZipFilePath);
    expect(getManagerMock.calledOnce).to.be.true;
    expect(
      unpackMock.calledWith(
        locations.downloadedZipFilePath,
        locations.unpackDir
      )
    ).to.be.true;
    expect(fsExtraMock.ensureFile.getCall(0).args[0]).to.equal(
      locations.itemJSON
    );
    expect(fsExtraMock.writeJSON.calledWith(locations.itemJSON, sampleArticle))
      .to.be.true;
    expect(relativePathOfMock.calledWith(sampleArticle.categories[0])).to.be
      .true;
    expect(
      fsExtraMock.move.calledWith(
        locations.unpackedZipDir,
        locations.installPath
      )
    ).to.be.true;
    expect(this.finalInstalledObject.installed[sampleArticle.id]).to.deep.equal(
      {
        id: sampleArticle.id,
        title: sampleArticle.title,
        location: locations.installPath,
        updated: sampleArticle.updated,
      }
    );
    rewiremock.disable();
  });

  test.it("should install testSMODS", async () => {
    const install = require("../../../src/operations/install/install");
    await install(
      sampleArticle,
      path.join(__dirname, "testFiles/testSMODS.zip")
    );
    const installedPath = path.join(
      global.testUserConfig.path.saveDir,
      "./Addons/Mods/",
      sampleArticle.id
    );
    expect(await fs.pathExists(installedPath)).to.be.true;
    expect(await fs.pathExists(path.join(installedPath, "item.json"))).to.be
      .true;
    const itemJSON = await fs.readJSON(path.join(installedPath, "item.json"));
    expect(
      await (
        await require("../../../src/helperFunctions/manager/getManager")()
      ).get("installed")[sampleArticle.id]
    ).to.deep.equal({
      title: sampleArticle.title,
      location: installedPath,
      id: sampleArticle.id,
      updated: sampleArticle.updated,
    });
    expect(itemJSON).to.deep.equal(sampleArticle);
  });

  test.it("should install testSTEAM", async () => {
    const install = require("../../../src/operations/install/install");
    await install(
      sampleArticle,
      path.join(__dirname, "testFiles/testSTEAM.zip")
    );
    const installedPath = path.join(
      global.testUserConfig.path.saveDir,
      "./Addons/Mods/",
      sampleArticle.id
    );
    expect(await fs.pathExists(installedPath)).to.be.true;
    expect(await fs.pathExists(path.join(installedPath, "item.json"))).to.be
      .true;
    const itemJSON = await fs.readJSON(path.join(installedPath, "item.json"));
    expect(
      await (
        await require("../../../src/helperFunctions/manager/getManager")()
      ).get("installed")[sampleArticle.id]
    ).to.deep.equal({
      title: sampleArticle.title,
      location: installedPath,
      id: sampleArticle.id,
      updated: sampleArticle.updated,
    });
    expect(itemJSON).to.deep.equal(sampleArticle);
  });
});
