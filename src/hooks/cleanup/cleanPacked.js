const fs = require("fs-extra");
const logUpdate = require("log-update");

module.exports = async function (opts) {
  const frames = [".", "..", "...", ""];
  let i = 0;
  let showCleanupMsg = false;
  const spinner = setInterval(() => {
    const frame = frames[(i = ++i % frames.length)];
    logUpdate(`Cleaning up downloads${frame}`);
    showCleanupMsg = true;
  }, 100);
  await fs.emptyDir(global.__packedDir);
  clearInterval(spinner);
  showCleanupMsg && logUpdate(`Cleaned up downloads`);
};
