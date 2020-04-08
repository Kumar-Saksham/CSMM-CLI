const Conf = require("conf");
const setupConfig = require("../../helperFunctions/setupUserConfig");
const fs = require("fs-extra");
const path = require("path");

const schema = {
  user: {
    type: "object",
    properties: {
      saveLocation: {
        type: "string",
        minLength: 1,
        maxLength: 255
      },
      tempFolder: {
        type: "string",
        minLength: 1,
        maxLength: 255
      },
      concurrency: {
        type: "integer",
        minimum: 1,
        maximum: 9
      }
    },
    required: ["saveLocation", "concurrency", "tempFolder"]
  }
};

const defaultVals = {
  user: {
    saveLocation: "UNDEFINED",
    concurrency: "UNDEFINED"
  },
  lastUpdated: null
};

const configExists = async () => {
  const options = {
    schema,
    configName: "userConfig",
    default: defaultVals,
    projectName: "csmm-cli"
  };

  let userConfig;
  try {
    userConfig = new Conf(options);
  } catch (e) {
    const { schema, ...rest } = options;
    const temp = new Conf(rest);
    await fs.remove(temp.path);
    userConfig = new Conf(options);
  }

  const fileExists = userConfig.get("lastUpdated");
  const validLastUpdated = Date.parse(userConfig.get("lastUpdated"));
  const validTempFolder = await fs.pathExists(
    userConfig.get("user.tempFolder")
  );

  const validSaveLocation = await fs.pathExists(
    userConfig.get("user.saveLocation")
  );

  if (
    !(fileExists && validSaveLocation && validLastUpdated && validTempFolder)
  ) {
    console.log("USER CONFIG SEEMS TO BE MISSING OR INVALID");
    try {
      await setupConfig(userConfig);
    } catch (e) {
      console.log("Unfinished or Invalid USER CONFIG, Terminating.", e.message);
      process.exit();
    }
  }

  global.__concurrencyLimit = userConfig.get("user.concurrency");
  global.__savesDirectory = userConfig.get("user.saveLocation");
  global.__tempFolder = userConfig.get("user.tempFolder");

  global.__logsFolder = path.join(__tempFolder, "logs");
  global.__packedFolder = path.join(__tempFolder, "packed");
  global.__unpackedFolder = path.join(__tempFolder, "unpacked");

  await fs.ensureDir(__logsFolder);
  await fs.ensureDir(__packedFolder);
  await fs.ensureDir(__unpackedFolder);
};

module.exports = configExists;
