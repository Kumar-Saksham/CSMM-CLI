const logUpdate = require("log-update");
const colors = require("ansi-colors");
const figures = require("figures");
const termSize = require("term-size");
const stringLength = require("string-length");
const Table = require("cli-table");

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
    this.finishedOps = [];
    this.log = logUpdate.create(process.stdout, { showCursor: false });
    this.previousOutput = "";
    this.terminalWidth = termSize().columns;
    this.progressBarWidth = 30;
    this.stats = {
      success: 0,
      fail: 0,
      warn: 0,
      total: options.total,
    };
    this.totalCount = options.total;
    this.disabled = options.disabled;
    this.setupTables();
    this.renderInterval = setInterval(() => {
      this.render();
    }, 80);
  }

  terminatingStates = [states.success, states.warn, states.fail];

  setupTables() {
    const chars = {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    };
    const style = { "padding-left": 0, "padding-right": 0 };
    const paddingRight = this.stats.success.toString.length + 3;
    const tableSeperatorLength = 1;

    //FOR ACTIVE PART
    const completeProgressBarLength = this.progressBarWidth + 2;
    const totalLengthExceptTitle =
      tableSeperatorLength + completeProgressBarLength + paddingRight;

    const maxTitleLength = Math.max(40, Math.floor(this.terminalWidth / 3));
    const skewedTitleLength = this.terminalWidth - totalLengthExceptTitle;

    let firstColWidth;
    if (maxTitleLength + totalLengthExceptTitle > this.terminalWidth)
      firstColWidth = skewedTitleLength;
    else firstColWidth = maxTitleLength;

    this.activeTable = new Table({
      chars,
      style,
      colWidths: [firstColWidth, completeProgressBarLength],
    });

    //FOR TERMINATED PART
    const finalSymbolLength = 3;
    const terminalWidthLeft =
      this.terminalWidth -
      tableSeperatorLength -
      finalSymbolLength -
      paddingRight;

    this.terminatedTable = new Table({
      chars,
      style,
      colWidths: [finalSymbolLength, terminalWidthLeft],
    });
  }

  get activeOpsToTable() {
    this.activeTable.length = 0;
    Object.values(this.activeOps).map((item) => {
      const styledItem = this.style[item.state](item);
      this.activeTable.push(styledItem);
    });

    return this.activeTable.toString().trim();
  }

  get finishedOpsToTable() {
    this.terminatedTable.length = 0;
    this.finishedOps.map((item) =>
      this.terminatedTable.push(this.style[item.state](item))
    );
    this.finishedOps.length = 0;
    return this.terminatedTable.toString();
  }

  get marginToText() {
    const successCounter = `${colors.yellow(` [${this.stats.success}]`)}`;
    return `${colors.grey(
      "━".repeat(this.terminalWidth - stringLength(successCounter))
    )}${successCounter}\n`;
  }

  renderText(options = { margin: true }) {
    const marginToRender = options.margin ? this.marginToText : "";
    const activeOpsToRender = this.activeOpsToTable;
    return `${marginToRender}${activeOpsToRender}`;
  }

  style = {
    START: (item) => `${item.title}: STARTING...`,

    GRAB_DOWNLOAD_LINK: (item) => [
      `${item.title}:`,
      `${colors.gray("GRABBING DOWNLOAD LINK...")}`,
    ],

    DOWNLOAD: (item) => {
      return [
        `${item.title}:`,
        `|${colors.green("#".repeat(item.progress))}${colors.dim(
          "-".repeat(this.progressBarWidth - item.progress)
        )}|`,
      ];
    },

    INSTALL: (item) => [`${item.title}:`, `${colors.gray("INSTALLING...")}`],

    SUCCESS: (item) => [`[${colors.green(figures.tick)}]`, `${item.title}`],

    WARN: (item) => [
      `[${colors.yellow("!")}]`,
      `${item.title} ${colors.yellow(item.message)}`,
    ],

    FAIL: (item) => [
      `[${colors.red("x")}]`,
      `${item.title} ${colors.red(item.message)}`,
    ],
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
    this.finishedOps.push(itemToDelete);
    if (this.stats.success + this.stats.fail >= this.stats.total)
      this.endRender();
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

    //this.render();
  }

  endRender() {
    this.render();
    clearInterval(this.renderInterval);
  }

  render(options) {
    if (!this.disabled) {
      const output = this.renderText(options);
      const finishedItemTable = this.finishedOpsToTable;
      if (finishedItemTable.trim().length > 0) {
        this.log(finishedItemTable);
        this.log.done();
      }
      this.log(output);
      this.previousOutput = output;
    }
  }
}

module.exports = Logger;
module.exports.states = states;
