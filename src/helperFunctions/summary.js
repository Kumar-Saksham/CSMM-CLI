const colors = require("ansi-colors");
const pretty = require("pretty-time");

const summary = (stats) => {
  this.success = stats.success;
  this.fail = stats.fail;
  this.warn = stats.warn;
  this.total = stats.total;
  this.time = stats.time;
  this.successWrd = stats.successWrd;

  return `${colors.green(this.success)}${colors.grey(
    `/${this.total || "total"}`
  )} ${this.successWrd} with ${colors.yellow(this.warn)} ${
    this.warn === 1 ? "retry" : "retries"
  } and ${colors.red(this.fail)} ${
    this.fail === 1 ? "failure" : "failures"
  } in ${colors.blue(pretty(this.time, "s"))}`;
};

module.exports = summary;
