const { Command } = require("@oclif/command");
const Table = require("cli-table");
const moment = require("moment");
const getManager = require("../helperFunctions/manager/getManager");

class ListCommand extends Command {
  async run() {
    const manager = await getManager();
    const table = new Table({
      head: ["#", "ID", "Title", "Last Updated"],
      colWidths: [10, 15, 50, 25]
    });

    const list = Object.values(manager.get("installed"));

    list.map((item, i) =>
      table.push([
        i + 1,
        item.id,
        item.title,
        moment(item.updated).format("lll")
      ])
    );

    console.log(table.toString());
  }
}

ListCommand.description = `List all the installed mods`;

module.exports = ListCommand;
