const colors = require("ansi-colors");

const promisePool = async (operationList, maxFlow = 5) => {
  const tokens = new Array(Math.min(maxFlow, operationList.length)).fill(
    Promise.resolve()
  );

  const stats = {
    total: operationList.length,
    successfull: -tokens.length,
    retries: 0
  };

  let operationListCopy = operationList.slice();

  const giveTo = (promise, operationOfPromise, tokenNo) => {
    return promise
      .then(opId => {
        stats.successfull++;
      })
      .catch(error => {
        console.log(colors.red("Caught by Pool"), error);
        stats.retries++;
        operationListCopy.push(operationOfPromise);
      })
      .finally(() => {
        if (operationListCopy.length) {
          //GETTING NEW OPERATION
          const newOperation = operationListCopy.shift();
          const newPromise = newOperation(tokenNo);
          return giveTo(newPromise, newOperation, tokenNo);
        } else return Promise.resolve();
      });
  };

  await Promise.all(tokens.map(giveTo));
  return stats;
};

module.exports = promisePool;
