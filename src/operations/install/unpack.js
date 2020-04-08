const fs = require("fs-extra");
const path = require("path");
const extract = require("extract-zip");
const Err = require("../../helperFunctions/err");

const unzip = async (source, destination) => {
  if (!(await fs.stat(source)).isFile()) {
    throw new Error("Source is not a file");
  }
  await fs.ensureDir(destination);

  let outputDirectory;
  try {
    await extract(source, {
      dir: destination,
      onEntry: entry => {
        if (!outputDirectory) {
          outputDirectory = entry.fileName.match(/([^/\\.])+/g)[0];
        }
      }
    });
  } catch (e) {
    throw new Err(`UNZIP ERROR: ${e.message}`, "FAIL");
  }

  return path.join(destination, outputDirectory);
};

module.exports = unzip;
