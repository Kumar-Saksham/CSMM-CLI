const { expect, test } = require("@oclif/test");
const parseFileUrl = require("../../src/helperFunctions/parseFileUrl");

describe("parseFileUrl", () => {
  test
    .do(() => {
      const details = parseFileUrl(
        "http://bck73.modsbasedl.com/cgi-bin/dl.cgi/1250957412_Funicular_Station_Tracks.zip"
      );
      expect(details.filename).to.equal(
        "1250957412_Funicular_Station_Tracks.zip"
      );
      expect(details.extension).to.equal(".zip");
      expect(details.id).to.equal("1250957412");
    })
    .do(() => {
      const details = parseFileUrl(
        "http://workplace.sample.info/255710/1392183934.zip"
      );
      expect(details.filename).to.equal("1392183934.zip");
      expect(details.extension).to.equal(".zip");
      expect(details.id).to.equal("1392183934");
    })
    .it("should parse correct id, filename, and extension");

  test.it(
    "should parse null for filename, id and extension on non-file url",
    () => {
      const details = parseFileUrl("https://www.google.com");
      expect(details.filename).to.be.null;
      expect(details.id).to.be.null;
      expect(details.extension).to.be.null;
    }
  );

  test.it(
    "should parse null for filename, id and extension on invlid url",
    () => {
      const details = parseFileUrl("testSample1234");
      expect(details.filename).to.be.null;
      expect(details.id).to.be.null;
      expect(details.extension).to.be.null;
    }
  );

  test.it(
    "should parse filename, id and extension on file url with # and ?",
    () => {
      const details = parseFileUrl(
        "http://www.example.com/filename_123456789.ext?lang=en&user=Aan9u/o8ai#top"
      );
      expect(details.filename).to.equal("filename_123456789.ext");
      expect(details.id).to.be.equal("123456789");
      expect(details.extension).to.be.equal(".ext");
    }
  );
});
