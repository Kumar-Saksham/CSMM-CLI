const { Confirm, Select, AutoComplete, prompt } = require("enquirer");
const colors = require("ansi-colors");

const selectFromList = async (list, name) => {
  // const editOrNot = new Confirm({
  //   name: "edit",
  //   message: `Edit ${name}?`,
  //   timers: { separator: 1000 },
  //   separator: state => {
  //     const time = 5;
  //     if (!state.submitted && state.timer.tick >= time) {
  //       editOrNot.submit();
  //     }
  //     return `${time - state.timer.tick}s`;
  //   },
  //   format() {
  //     if (!this.submitted) return colors.cyan(this.value ? "Yeah" : "Nae");
  //   }
  // });

  // const edit = await editOrNot.run();

  // if (edit) {
  const installOrIgnore = new Select({
    name: "select",
    message: `Edit options`,
    hint: "(Use <arrow> keys to navigate, <return> to select)",
    choices: [
      {
        name: "Select to keep",
        value: true
      },
      {
        name: "Select to ignore",
        value: false
      }
    ],
    pointer(state, index) {
      if (this.state.index === index) {
        return index === 0
          ? colors.green(this.state.symbols.plus)
          : colors.red(this.state.symbols.minus);
      } else return " ";
    },
    result(options) {
      return this.map(options)[options];
    }
  });

  const installSelected = await installOrIgnore.run();

  if (installSelected) {
    const selectToInstall = new AutoComplete({
      name: "selectItems",
      message: `${colors.bold("Select items to be installed:")}`,
      separator(state) {
        return colors.yellow(this.symbols.bullet);
      },
      hint: "(start typing to search, <space> to select, <return> to submit)",

      limit: 15,
      styles: { em: colors.yellow.inverse },
      choices: [
        { role: "separator" },
        ...list.map(item => {
          return {
            name: item.title,
            value: item
          };
        })
      ],
      multiple: true,
      format() {
        return `${colors.green(this.selected.length)}${colors.dim(
          `/${list.length}`
        )}${this.input ? `, search: ${colors.blue(this.input)}` : ""}`;
      },
      indicator(state, choice) {
        if (choice && choice.enabled) {
          return colors.green.bold(state.symbols.plus);
        } else return colors.dim(state.symbols.minus);
      },
      choiceMessage(choice, i) {
        if (choice)
          return choice.enabled
            ? colors.greenBright(choice.message)
            : choice.message;
      },
      footer() {
        return colors.dim("(Scroll up and down to reveal more choices)");
      },
      result(titles) {
        return this.map(titles);
      }
    });

    const results = await selectToInstall.run();
    const items = Object.values(results);
    return items;
  } else {
    const selectToIgnore = new AutoComplete({
      name: "selectItems",
      message: `${colors.bold("Select items to be ignored:")}`,
      separator(state) {
        return colors.yellow(this.symbols.bullet);
      },
      hint: "(start typing to search, <space> to select, <return> to submit)",

      limit: 15,
      styles: { em: colors.yellow.inverse },
      choices: list.map(item => {
        return {
          name: item.title,
          value: item
        };
      }),
      multiple: true,
      format() {
        return `${colors.red(this.selected.length)}${colors.dim(
          `/${list.length}`
        )}${this.input ? `, search: ${colors.blue(this.input)}` : ""}`;
      },
      indicator(state, choice) {
        if (choice && choice.enabled) {
          return colors.red.bold(state.symbols.minus);
        } else return colors.dim(state.symbols.plus);
      },
      choiceMessage(choice, i) {
        if (choice)
          return choice.enabled ? colors.red(choice.message) : choice.message;
      },
      footer() {
        return colors.dim("(Scroll up and down to reveal more choices)");
      },
      result(titles) {
        return this.choices
          .filter(item => !titles.includes(item.name))
          .map(item => item.value);
      }
    });

    const remainingItems = await selectToIgnore.run();
    return remainingItems;
  }
  //  } else return list;
};

module.exports = selectFromList;
