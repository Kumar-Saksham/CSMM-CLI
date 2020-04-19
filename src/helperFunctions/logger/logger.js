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
    this.activeOps = {};
    this.log = logUpdate.create(process.stdout, { showCursor: false });
    this.previousOutput = "";
    this.terminalWidth = termSize().columns;
    this.progressBarWidth = 40;
    this.stats = {
      success: 0,
      fail: 0,
      warn: 0,
      total: options.total,
    };
    this.totalCount = options.total;
    this.disabled = options.disabled;
  }

  terminatingStates = [states.success, states.warn, states.fail];

  get opsToText() {
    return Object.values(this.activeOps)
      .map((item) => this.style[item.state](item))
      .join("\n");
  }

  get marginToText() {
    const successCounter = `${colors.yellow(` [${this.stats.success}]`)}`;
    return `${colors.grey(
      "━".repeat(this.terminalWidth - stringLength(successCounter))
    )}${successCounter}\n`;
  }

  renderText(options = { margin: true }) {
    const marginToRender = options.margin ? this.marginToText : "";
    const opsToRender = this.opsToText;
    return `${marginToRender}${opsToRender}`;
  }

  style = {
    START: (item) => `${item.title}: STARTING...`,
    GRAB_DOWNLOAD_LINK: (item) =>
      `${item.title}: ${colors.magenta("GRABBING DOWNLOAD LINK...")}`,
    DOWNLOAD: (item) => {
      return `${item.title}: |${colors.green(
        "#".repeat(item.progress)
      )}${colors.dim("-".repeat(this.progressBarWidth - item.progress))}|`;
    },
    INSTALL: (item) => `${item.title}: ${colors.magenta("INSTALLING...")}`,
    SUCCESS: (item) => `[${colors.green(figures.tick)}] ${item.title}`,
    WARN: (item) =>
      `[${colors.yellow("!")}] ${item.title} ${colors.yellow(item.message)}`,
    FAIL: (item) =>
      `[${colors.red("x")}] ${item.title} ${colors.red(item.message)}`,
  };

  insert(item) {
    this.activeOps[item.id] = {
      title: item.title,
      state: states.start,
      progress: 0,
      message: "",
    };
  }

  remove(id) {
    const itemToDelete = this.activeOps[id];
    delete this.activeOps[id];
    const activesBackup = this.activeOps;
    this.activeOps = [itemToDelete];
    this.render({ margin: false });
    this.log.done();
    this.log = logUpdate.create(process.stderr, { showCursor: false });
    this.activeOps = activesBackup;
    this.render();
  }

  updateStats(state) {
    switch (state) {
      case states.success:
        this.stats.success++;
        break;
      case states.warn:
        this.stats.warn++;
        break;
      case states.fail:
        this.stats.fail++;
        break;
      default:
    }
  }

  update(id, state, progress, message = "") {
    const itemToUpdate = this.activeOps[id];
    itemToUpdate.state = state;

    if (this.terminatingStates.includes(state)) {
      this.updateStats(state);
      itemToUpdate.message = message;
      this.remove(id);
    }

    if (progress) {
      const newProgressValue = Math.floor(progress * this.progressBarWidth);
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
