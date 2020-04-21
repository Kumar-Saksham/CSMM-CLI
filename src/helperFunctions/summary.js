const colors = require("ansi-colors");
const pretty = require("pretty-time");

const summary = (stats) => {
  this.success = stats.success;
  this.fail = stats.fail;
  this.warn = stats.warn;
  this.total = stats.total;
  this.time = stats.time;
  this.successWrd = stats.successWrd;

  const succStr = `${colors.green(this.success)}${
    this.total ? colors.grey(`/${this.total}`) : ""
  } ${this.successWrd} `;

  const retryStr = `${colors.yellow(this.warn)} ${
    this.warn === 1 ? "retry" : "retries"
  }`;

  const failStr = `${colors.red(this.fail)} ${
    this.fail === 1 ? "failure" : "failures"
  }`;

  const timeStr = this.time ? `in ${colors.blue(pretty(this.time, "s"))} ` : "";

  const extrasStr = `${
    this.fail !== undefined || this.warn !== undefined
      ? `with ${
          this.warn !== undefined && this.fail !== undefined
            ? `${retryStr} and ${failStr}`
            : `${this.warn !== undefined ? retryStr : failStr}`
        } `
      : ""
  }`;

  const fullStr = `${succStr}${extrasStr}${timeStr}`;

  return fullStr;
};

module.exports = summary;
