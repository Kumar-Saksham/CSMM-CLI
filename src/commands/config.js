const { Command, flags } = require("@oclif/command");
const colors = require("ansi-colors");
const getUserConfig = require("../helperFunctions/userConfig/getUserConfig");
const setupUserConfig = require("../helperFunctions/userConfig/setupUserConfig");

const {
  concurrencyValidation,
  transferProgressTimeoutValidation,
  saveDirValidation,
  tmpDirValidation,
} = require("../helperFunctions/userConfig/validation");

const configStructure = {
  concurrency: {
    path: "process.concurrency",
    validate: concurrencyValidation,
    convert: (x) => {
      x = Number(x);
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    },
  },
  transferProgressTimeout: {
    path: "process.transferProgressTimeout",
    validate: transferProgressTimeoutValidation,
    convert: (x) => {
      x = Number(x);
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    },
  },
  saveDir: {
    path: "path.saveDir",
    validate: saveDirValidation,
    convert: (tmp) => tmp,
  },
  tmpDir: {
    path: "path.tmpDir",
    validate: tmpDirValidation,
    convert: (tmp) => tmp,
  },
};

class ConfigCommand extends Command {
  async run() {
    const { args } = this.parse(ConfigCommand);

    const userConfig = await getUserConfig();

    if (args.property) {
      const property = configStructure[args.property];
      if (property && userConfig.has(property.path)) {
        const currVal = userConfig.get(property.path);
        if (args.value) {
          const value = property.convert(args.value);
          const isValueValid = await property.validate(value);
          if (isValueValid) {
            console.log(`${args.property} set to: ${colors.green(value)}`);
            userConfig.set(property.path, value);
          } else {
            console.log(`${colors.red("Invalid input for")} ${args.property}`);
          }
        } else {
          console.log(`${args.property}: ${colors.green(currVal)}`);
        }
      } else {
        console.log(`${colors.red("Invalid property name")}: ${args.property}`);
      }
    } else {
      try {
        await setupUserConfig(userConfig, { suggestCurrentValues: true });
      } catch (e) {
        console.log(`${colors.yellow("Cancelling configuration")}`);
      }
    }
  }
}

ConfigCommand.description = `View or Modify User Config`;

ConfigCommand.args = [
  { name: "property", options: Object.keys(configStructure), hidden: true },
  { name: "value", hidden: true },
];

module.exports = ConfigCommand;
