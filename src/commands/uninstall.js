const { Command } = require("@oclif/command");
const colors = require("ansi-colors");
const { AutoComplete } = require("enquirer");
const deleteItem = require("../operations/delete/deleteItem");
const getManager = require("../helperFunctions/manager/getManager");

class UninstallCommand extends Command {
  async run() {
    const { args } = this.parse(UninstallCommand);
    const steamId = args.steamId;

    const manager = await getManager();
    const itemInstalled = Object.values(manager.get("installed"));
    if (itemInstalled.length === 0) {
      console.log("You don't have any mods installed.");
      return;
    }

    if (steamId) {
      try {
        const deletedItem = await deleteItem(steamId);
        console.log(colors.red("Successfully Uninstalled"), deletedItem);
      } catch (e) {
        console.log("Error Uninstalling:", e.message);
      }
      return;
    }

    const selectToDelete = new AutoComplete({
      name: "selectItems",
      message: `${colors.bold("Select items to be deleted:")}`,
      separator() {
        return colors.yellow(this.symbols.bullet);
      },
      hint: "(start typing to search, <space> to select, <return> to submit)",

      limit: 15,
      styles: { em: colors.yellow.inverse },
      choices: [
        { role: "separator" },
        ...itemInstalled.map(item => {
          return {
            name: item.title,
            value: item
          };
        })
      ],
      multiple: true,
      format() {
        return `${colors.red(this.selected.length)}${colors.dim(
          `/${itemInstalled.length}`
        )}${this.input ? `, search: ${colors.blue(this.input)}` : ""}`;
      },
      indicator(state, choice) {
        if (choice && choice.enabled) {
          return colors.red.bold(state.symbols.minus);
        } else return colors.white(state.symbols.bullet);
      },
      choiceMessage(choice, i) {
        if (choice)
          return choice.enabled ? colors.red(choice.message) : choice.message;
      },
      footer() {
        return colors.dim("(Scroll up and down to reveal more choices)");
      },
      result(titles) {
        return this.map(titles);
      }
    });

    let results;
    try {
      results = await selectToDelete.run();
    } catch (e) {
      console.log("Nothing Uninstalled", e);
      return;
    }

    const initTime = process.hrtime();
    const itemsToDelete = Object.values(results);
    let deletedCount = 0;
    for (const item of itemsToDelete) {
      try {
        const deletedItem = await deleteItem(item.id);
        console.log(colors.red("Successfully Uninstalled"), deletedItem);
        deletedCount++;
      } catch (e) {
        console.log(colors.red(`Error Uninstalling ${item.title}:`), e.message);
      }
    }
    const endTime = process.hrtime(initTime);
    console.log(
      `${colors.red(deletedCount)} item(s) deleted in ${colors.blue(
        `${endTime[0] + (endTime[1] / 1000000000).toFixed(3)}s`
      )}`
    );
  }
}

UninstallCommand.description = `Uninstall an item`;

UninstallCommand.args = [
  { name: "steamId", description: "SteamID of installed item" }
];

module.exports = UninstallCommand;
