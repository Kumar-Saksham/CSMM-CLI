const fs = require("fs-extra");

const dirValidation = async (path) => {
  return path && (await fs.pathExists(path));
};

const ToInteger = (x) => {
  x = Number(x);
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

const saveDirValidation = async (path) => {
  return await dirValidation(path);
};

const tmpDirValidation = async (path) => {
  return await dirValidation(path);
};

const concurrencyValidation = async (concurrency) => {
  concurrency = ToInteger(concurrency);
  return concurrency && concurrency <= 6 && concurrency >= 1;
};

const transferProgressTimeoutValidation = async (time) => {
  time = ToInteger(time);
  return time && time >= 5000;
};

const validation = async (userConfig) => {
  const saveDir = userConfig.get("path.saveDir");
  const tmpDir = userConfig.get("path.tmpDir");
  const concurrency = userConfig.get("process.concurrency");
  const transferProgressTimeout = userConfig.get(
    "process.transferProgressTimeout"
  );

  const isValidSaveDir = await saveDirValidation(saveDir);
  const isValidTmpDir = await tmpDirValidation(tmpDir);
  const isValidConcurrency = await concurrencyValidation(concurrency);
  const isValidTransferProgressTimeout = await transferProgressTimeoutValidation(
    transferProgressTimeout
  );

  const errors = [];

  if (!isValidTmpDir) {
    errors.push("TEMP_FOLDER");
  }

  if (!isValidSaveDir) {
    errors.push("SAVE_LOCATION");
  }

  if (!isValidConcurrency) {
    errors.push("CONCURRENCY");
  }

  if (!isValidTransferProgressTimeout) {
    errors.push("TRANSFER_PROGRESS_TIMEOUT");
  }

  return { valid: !errors.length, errors };
};

module.exports = validation;
module.exports.saveDirValidation = saveDirValidation;
module.exports.tmpDirValidation = tmpDirValidation;
module.exports.concurrencyValidation = concurrencyValidation;
module.exports.transferProgressTimeoutValidation = transferProgressTimeoutValidation;
