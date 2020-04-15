const Conf = require("conf");
const schema = require("./userConfigSchema");
const validate = require("./validation").configValidation;
const setup = require("./setupUserConfig");
const defaultUserConfig = require("./defaultUserConfig").config;

const getUserConfig = async () => {
  const options = {
    configName: "userConfig",
    projectName: "csmm-cli",
    default: defaultUserConfig,
  };

  userConfig = new Conf(options);

  const validity = await validate(userConfig);

  if (!validity.valid || !userConfig.has("lastUpdated")) {
    console.error(validity.errors);
    userConfig.reset("path", "process");

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
