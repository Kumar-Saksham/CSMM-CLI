const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");
const { promisify } = require("util");
const uuid = require("uuid").v4;
const got = require("got");
const parseFileUrl = require("../../helperFunctions/parseFileUrl");
const Err = require("../../helperFunctions/err");

const pipeline = promisify(stream.pipeline);

const download = (url, directory, filename, onProgress) => {
  const fromURL = parseFileUrl(url);
  filename = `${filename || uuid()}${fromURL.extension}`;

  return new Promise((resolve, reject) => {
    const downloadStream = got
      .stream(url)
      .on("response", async (response) => {
        if (!response.headers["content-type"].includes("application")) {
          //Not a file
          let completeResponse = "";
          for await (const chunk of downloadStream) {
            completeResponse += chunk;
          }

          reject(new Err(`Not a file: ${completeResponse}`, "FAIL"));
        } else {
          //valid file
          let noProgressTimer;
          const noProgressTimeout = 5000;

          downloadStream.on("downloadProgress", (progress) => {
            if (noProgressTimer) clearTimeout(noProgressTimer);
            onProgress(progress);
            noProgressTimer = setTimeout(() => {
              try {
                downloadStream.destroy();
              } finally {
              }
            }, noProgressTimeout);
          });

          //setting up file
          await fs.ensureDir(directory);
          const fileLink = path.join(directory, filename);
          const fileWriteStream = fs.createWriteStream(fileLink);

          //downloading
          try {
            await pipeline(downloadStream, fileWriteStream);
            clearTimeout(noProgressTimer);
          } catch (e) {
            clearTimeout(noProgressTimer);
            await fs.remove(fileLink);
            reject(Error("Download Stuck"));
          }
          resolve(fileLink);
        }
      })
      .on("error", (e) => {
        reject(e);
      });
  });
};

module.exports = download;
