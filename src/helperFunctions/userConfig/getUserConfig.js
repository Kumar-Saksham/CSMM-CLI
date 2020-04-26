const Conf = require("conf");
const schema = require("./userConfigSchema");
const validate = require("./validation").configValidation;
const setup = require("./setupUserConfig");
const defaultUserConfig = require("./defaultUserConfig").config;

const getUserConfig = async (testUserConfigStore) => {
  let options;
  if (process.env.NODE_ENV === "test") {
    options = {
      configName: "testUserConfig",
      projectName: "csmm-cli",
      defaults: testUserConfigStore,
      cwd: global.testDir,
    };
  } else {
    options = {
      configName: "userConfig",
      projectName: "csmm-cli",
      defaults: defaultUserConfig,
    };
  }

  userConfig = new Conf(options);

  const validity = await validate(userConfig);

  if (!validity.valid || !userConfig.has("lastUpdated")) {
    //console.error(validity.errors);
    userConfig.reset("path", "process");
    if (process.env.NODE_ENV === "test") {
      return userConfig;
    }
    try {
      await setup(userConfig);
    } catch (e) {
      //console.debug(e);
      process.exit();
    }
  }
  return userConfig;
};

module.exports = getUserConfig;
