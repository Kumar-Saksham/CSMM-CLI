const logUpdate = require("log-update");
const colors = require("ansi-colors");
const figures = require("figures");
const termSize = require("term-size");
const stringLength = require("string-length");

const states = {
  start: "START",
  grabLink: "GRAB_DOWNLOAD_LINK",
  download: "DOWNLOAD",
  install: "INSTALL",
  success: "SUCCESS",
  warn: "WARN",
  fail: "FAIL",
};

class Logger {
  constructor(options = { disabled: false }) {
    this.actives = {};
    this.log = logUpdate.create(process.stdout, { showCursor: false });
    this.previousOutput = "";
    this.marginWidth = termSize().columns;
    this.barWidth = 40;
    this.successfullyCompleted = 0;
    this.totalCount = options.total;
    this.disabled = options.disabled;
  }

  terminatingStates = [states.success, states.warn, states.fail];

  renderText(options = { margin: true }) {
    const itemsToRender = Object.values(this.actives);

    const successCounter = `${colors.yellow(
      ` [${this.successfullyCompleted}]`
    )}`;

    const margin = `${colors.grey(
      "━".repeat(this.marginWidth - stringLength(successCounter))
    )}${successCounter}\n`;

    return `${options.margin ? margin : ""}${itemsToRender
      .map((item) => this.style[item.state](item))
      .join("\n")}`;
  }

  style = {
    START: (item) => `${item.title}: STARTING...`,
    GRAB_DOWNLOAD_LINK: (item) =>
      `${item.title}: ${colors.magenta("GRABBING DOWNLOAD LINK...")}`,
    DOWNLOAD: (item) => {
      return `${item.title}: |${colors.green(
        "#".repeat(item.progress)
      )}${colors.dim("-".repeat(this.barWidth - item.progress))}|`;
    },
    INSTALL: (item) => `${item.title}: ${colors.magenta("INSTALLING...")}`,
    SUCCESS: (item) => `[${colors.green(figures.tick)}] ${item.title}`,
    WARN: (item) =>
      `[${colors.yellow("!")}] ${item.title} ${colors.yellow(item.message)}`,
    FAIL: (item) =>
      `[${colors.red("x")}] ${item.title} ${colors.red(
        item.message
      )}`,
  };

  insert(item) {
    this.actives[item.id] = {
      title: item.title,
      state: states.start,
      progress: 0,
      message: "",
    };
    //this.render();
  }

  remove(id) {
    const itemToDelete = this.actives[id];
    delete this.actives[id];
    const activesBackup = this.actives;
    this.actives = [itemToDelete];
    this.render({ margin: false });
    this.log.done();
    this.log = logUpdate.create(process.stderr, { showCursor: false });
    this.actives = activesBackup;
    this.render();
    //console.log(this.style[itemToDelete.state](itemToDelete));
  }

  update(id, state, progress, message = "") {
    const itemToUpdate = this.actives[id];
    itemToUpdate.state = state;

    if (this.terminatingStates.includes(state)) {
      if (state === states.success) {
        this.successfullyCompleted++;
      }
      itemToUpdate.message = message;
      this.remove(id);
    }

    if (progress) {
      const newProgressValue = Math.floor(progress * this.barWidth);
      if (newProgressValue === itemToUpdate.progress) {
        return;
      }
      itemToUpdate.progress = newProgressValue;
    }
    this.render();
  }

  render(options) {
    if (!this.disabled) {
      const output = this.renderText(options);
      this.log(output);
      this.previousOutput = output;
    }
  }
}

module.exports = Logger;
module.exports.states = states;
