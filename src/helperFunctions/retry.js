const retry = async (
  unsafeFunction,
  catchFunction,
  doomedFunction,
  forceExit,
  maxAttempts = 3
) => {
  let currentAttempt = 0;
  if (!unsafeFunction) {
    throw new Error("Missing unsafe function");
  }

  while (true) {
    if (currentAttempt >= maxAttempts || (forceExit && forceExit())) {
      doomedFunction && (await doomedFunction());
      break;
    }
    currentAttempt++;
    try {
      await unsafeFunction();
      break;
    } catch (e) {
      catchFunction && (await catchFunction(e));
    }
  }
};

module.exports = retry;
