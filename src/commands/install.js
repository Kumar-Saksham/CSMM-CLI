const { Command, flags } = require("@oclif/command");
const colors = require("ansi-colors");
const Err = require("../helperFunctions/err");
const Logger = require("../helperFunctions/logger/logger");
const loggerStates = Logger.states;
const getLinkSteam = require("../operations/download/getLinkSteam");
const getLinkSmods = require("../operations/download/getLinkSmods");
const download = require("../operations/download/download");
const installItem = require("../operations/install/install");
const promisePool = require("../helperFunctions/promisePool");
const getMetadata = require("../operations/getMetadata/getMetadata");
const summary = require("../helperFunctions/summary");

//const nodeChecker = require("why-is-node-running");

class InstallCommand extends Command {
  async run() {
    const { flags, args } = this.parse(InstallCommand);

    const steamId = args.steamId;
    const method = flags.method;
    const edit = flags.edit;

    //validate steamId

    //START
    console.log(colors.yellow("Grabbing Details"));
    const startTime = process.hrtime();
    global.__edit = edit;
    //GET DATA FOR ITEMS
    let articleDirectory;
    try {
      articleDirectory = await getMetadata(steamId);
    } catch (e) {
      console.log(colors.red("Error while grabbing data:"), e.message);
      return;
    }

    const articleList = Object.values(articleDirectory);
    console.log(colors.yellow("\nTOTAL ITEM COUNT:"), articleList.length);

    const logger = new Logger({
      total: articleList.length,
      disabled: process.env.NODE_ENV === "test",
    });
    const seq = async (article) => {
      try {
        logger.insert(article);

        logger.update(article.id, loggerStates.grabLink);
        let downloadLink;

        switch (method) {
          case "STEAM":
            downloadLink = await getLinkSteam(article.id);
            break;
          case "SMODS":
            downloadLink = await getLinkSmods(article.id);
            break;
          default:
            new Err("Invalid method", "FAIL");
        }

        const downloadedFilePath = await download(
          downloadLink,
          __packedDir,
          undefined,
          (progress) => {
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
        if (e.type === "FAIL") {
          logger.update(article.id, loggerStates.fail, null, e.message);
          return Promise.resolve();
        }
        logger.update(article.id, loggerStates.warn, null, e.message);
        return Promise.reject(e);
      }
    };

    await promisePool(
      articleList.map((article) => () => seq(article)),
      __concurrencyLimit
    );

    const timeTaken = process.hrtime(startTime);
    const stats = {
      ...logger.stats,
      time: timeTaken,
      successWrd: "installed",
    };

    console.log(summary(stats));
    await this.config.runHook("cleanup", {});
    //setTimeout(() => nodeChecker(), 1000);
  }
}

InstallCommand.description = `Install a single mod or a collection along with their dependencies. Use id in steam URL as the SteamID.`;

InstallCommand.flags = {
  edit: flags.boolean({
    char: "e",
    description:
      "To edit items of a collection (will be ignored for single item)",
    default: false,
  }),
  method: flags.string({
    char: "m",
    description: "download from Steam or Smods?",
    options: ["STEAM", "SMODS"],
    default: "STEAM",
  }),
};

InstallCommand.args = [
  {
    name: "steamId",
    required: true,
    description: "SteamID of item/collection",
  },
];

module.exports = InstallCommand;
