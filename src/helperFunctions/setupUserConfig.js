const path = require("path");
const { Input } = require("enquirer");
const colors = require("ansi-colors");
const fs = require("fs-extra");

const setupConfig = async userConfig => {
  console.log(colors.cyanBright("USER CONFIG SETUP"));
  const homeDirLoc =
    process.env.LOCALAPPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Application Support"
      : process.env.HOME + "/.local/share");

  const locationInHomeDir = "/Colossal Order/Cities_Skylines/";

  const currentSaveLocation = userConfig.get("user.saveLocation");
  const defaultSaveLocation = path.join(homeDirLoc, locationInHomeDir);

  const currentTempLocation = userConfig.get("user.tempFolder");
  const defaultTempLocation = path.join(__dirname, "..", "..", "tmp");

  const saveLocationSuggestion = (await fs.pathExists(currentSaveLocation))
    ? currentSaveLocation
    : defaultSaveLocation;

  const tempFolderSuggestion = (await fs.pathExists(currentTempLocation))
    ? currentTempLocation
    : defaultTempLocation;

  const concurrencySuggestion = userConfig.get("user.concurrency") || 5;

  const saveLocationPrompt = new Input({
    message: `Enter your ${colors.yellowBright(
      "Cities: Skylines Saves directory"
    )}`,
    initial: `${saveLocationSuggestion}`,
    validate(input) {
      return fs.pathExistsSync(input);
    }
  });

  const concurrencyPrompt = new Input({
    message: `Enter the ${colors.yellowBright(
      "max no. of concurrent tasks"
    )} ${colors.grey("(1 - 6)")}`,
    initial: concurrencySuggestion,
    validate(input) {
      return parseInt(input) && input >= 1 && input <= 6;
    },
    result(value) {
      return parseInt(value);
    }
  });

  const tempFolderPrompt = new Input({
    message: `Enter a ${colors.yellowBright(
      "directory to save temperory downloads"
    )}`,
    initial: `${tempFolderSuggestion}`,
    validate(input) {
      fs.ensureDirSync(input);
      return fs.pathExistsSync(input);
    }
  });

  try {
    const saveLocation = await saveLocationPrompt.run();
    const concurrency = await concurrencyPrompt.run();
    const tempFolder = await tempFolderPrompt.run();

    userConfig.set({
      ...userConfig.store,
      user: {
        saveLocation,
        concurrency,
        tempFolder
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (e) {
    console.log("Exiting config setup", e);
  }
};

module.exports = setupConfig;
