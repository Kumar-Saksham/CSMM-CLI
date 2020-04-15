const { Input } = require("enquirer");
const colors = require("ansi-colors");

const dflt = require("./defaultUserConfig");
const {
  saveDirValidation,
  tmpDirValidation,
  concurrencyValidation,
} = require("./validation");

const setupConfig = async (
  userConfig,
  options = { suggestCurrentValues: false }
) => {
  console.log(colors.blue("USER CONFIG SETUP"));

  let saveDirSuggestion = dflt.saveDir;
  let tmpDirSuggestion = dflt.tmpDir;
  let concurrencySuggestion = dflt.concurrency;

  if (options.suggestCurrentValues) {
    const currentSaveDir = userConfig.get("path.saveDir");
    const currentTmpDir = userConfig.get("path.tmpDir");
    const currentConcurrency = userConfig.get("process.concurrency");

    saveDirSuggestion = currentSaveDir ? currentSaveDir : saveDirSuggestion;
    tmpDirSuggestion = currentTmpDir ? currentTmpDir : tmpDirSuggestion;
    concurrencySuggestion = currentConcurrency
      ? currentConcurrency
      : concurrencySuggestion;
  }

  const saveDirPrompt = new Input({
    message: `Enter your ${colors.yellowBright(
      "Cities: Skylines Save directory path"
    )}`,
    initial: `${saveDirSuggestion}`,
    async validate(input) {
      const valid = await saveDirValidation(input);
      return valid
        ? true
        : "The entered path is invalid. Please enter complete path to the directory.";
    },
  });

  const tmpFolderPrompt = new Input({
    message: `Enter a ${colors.yellowBright(
      "directory path to save temperory downloads"
    )}`,
    initial: `${tmpDirSuggestion}`,
    async validate(input) {
      const valid = await tmpDirValidation(input);
      return valid
        ? true
        : "The entered path is invalid. Please enter complete path to the directory.";
    },
  });

  const concurrencyPrompt = new Input({
    message: `Enter the ${colors.yellowBright(
      "max no. of concurrent tasks"
    )} ${colors.grey("(1 - 6)")}`,
    initial: concurrencySuggestion,
    async validate(input) {
      input = parseInt(input);
      const valid = await concurrencyValidation(input);
      return valid
        ? true
        : "Enter an integer value between 1 and 6 (inclusive).";
    },
    result(value) {
      return parseInt(value);
    },
  });

  try {
    const saveDir = await saveDirPrompt.run();
    const tmpDir = await tmpFolderPrompt.run();
    const concurrency = await concurrencyPrompt.run();

    userConfig.set({
      ...userConfig.store,
      path: {
        saveDir,
        tmpDir,
      },
      process: {
        concurrency,
        transferProgressTimeout: dflt.transferProgressTimeout,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (e) {
    console.log(`Cancelling ${colors.blue("USER CONFIG SETUP")}`, e);
    throw new Error("Error while completing userConfig");
  }
};

module.exports = setupConfig;
