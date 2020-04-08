const retry = async (
  unsafeFuntion,
  catchFunciton,
  doomedFuntion,
  forceExit,
  maxAttempts = 3
) => {
  let currentAttempt = 0;

  while (true) {
    if (currentAttempt >= maxAttempts || forceExit()) {
      await doomedFuntion();
      break;
    }
    currentAttempt++;
    try {
      await unsafeFuntion();
      break;
    } catch (e) {
      await catchFunciton();
    }
  }
};

module.exports = retry;
