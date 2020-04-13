const { Command, flags } = require("@oclif/command");
const path = require("path");
const colors = require("ansi-colors");
const download = require("../operations/download/download");
const getMetadata = require("../operations/getMetadata/getMetadata");
const getLinkSteam = require("../operations/download/getLinkSteam");
const getManager = require("../helperFunctions/manager/getManager");
const installItem = require("../operations/install/install");
const promisePool = require("../helperFunctions/promisePool");
const Logger = require("../helperFunctions/logger/logger");
const loggerStates = Logger.states;

class UpdateCommand extends Command {
  async run() {
    const { flags } = this.parse(UpdateCommand);
    //SETUP
    const startTime = process.hrtime();
    const manager = await getManager();

    //START
    console.log(
      colors.yellow("Grabbing Updated Details"),
      colors.grey("(it's not stuck)")
    );

    const installedItems = manager.get("installed");
    const installedItemsList = Object.values(installedItems);

    let finalItemDirectory = {};
    await promisePool(
      installedItemsList.map(item => () => {
        return getMetadata(item.id).then(articlesObj => {
          finalItemDirectory = { ...finalItemDirectory, ...articlesObj };
        });
      }),
      __concurrencyLimit
    );

    const updatedItemDetails = Object.values(finalItemDirectory);
    const toUpdateItemList = updatedItemDetails.filter(item => {
      let installedUpdatedAt;
      try {
        installedUpdatedAt = new Date(installedItems[item.id].updated);
      } catch {
        return true;
      }
      const freshUpdatedAt = new Date(item.updated);
      return freshUpdatedAt - installedUpdatedAt > 0;
    });

    if (!toUpdateItemList.length) {
      console.log(colors.green("Everything is up to date"));
      return;
    }

    console.log(colors.yellow("\nTOTAL ITEM COUNT:"), toUpdateItemList.length);

    const logger = new Logger();
    const seq = async article => {
      try {
        logger.insert(article);
        logger.update(article.id, loggerStates.grabLink);
        const downloadLink = await getLinkSteam(article.id);

        const downloadedFilePath = await download(
          downloadLink,
          __packedDir,
          undefined,
          progress => {
            logger.update(article.id, loggerStates.download, progress.percent);
          }
        );

        if (!downloadedFilePath) {
          logger.update(article.id, loggerStates.fail);
          return;
        }

        logger.update(article.id, loggerStates.install);
        await installItem(article, downloadedFilePath);

        logger.update(article.id, loggerStates.success);
      } catch (e) {
        logger.update(article.id, loggerStates.fail, null, e.message);
        if (e.type === "FAIL") {
          return Promise.resolve();
        }
        return Promise.reject(e.message);
      }
    };

    const stats = await promisePool(
      toUpdateItemList.map(article => () => seq(article)),
      5
    );

    const timeTaken = process.hrtime(startTime);
    stats.time = timeTaken;
    console.log(
      `${colors.green(stats.successfull)}${colors.dim(
        `/${stats.total}`
      )} completed with ${colors.yellow(
        stats.retries
      )} retries in ${colors.blue(`${stats.time[0]}s`)}`
    );
  }
}

UpdateCommand.description = `Updates all of the items installed. Will also install missing dependencies (required items) if any.`;

module.exports = UpdateCommand;
