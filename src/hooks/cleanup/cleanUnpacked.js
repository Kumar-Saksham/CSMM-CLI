const fs = require("fs-extra");
const logUpdate = require("log-update");

module.exports = async function (opts) {
  const frames = [".", "..", "...", ""];
  let i = 0;
  let showCleanupMsg = false;
  const spinner = setInterval(() => {
    const frame = frames[(i = ++i % frames.length)];
    logUpdate(`Cleaning up unpacked files${frame}`);
    showCleanupMsg = true;
  }, 100);
  await fs.emptyDir(global.__unpackedDir);
  clearInterval(spinner);
  showCleanupMsg && logUpdate(`Cleaned up unpacked files`);
};
