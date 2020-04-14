const { expect, test } = require("@oclif/test");
const promisePool = require("../../src/helperFunctions/promisePool");

const operationsListGenerator = (count, failRate) => {
  const operationsList = [];
  for (let i = 0; i < count; i++) {
    operationsList.push(
      operationGenerator(
        typeof failRate === "number" ? failRate : failRate(),
        i
      )
    );
  }
  return operationsList;
};

const operationGenerator = (failProbability, operationId = "") => {
  return () =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (Math.random() < failProbability) {
          onFail && onFail();
          reject(operationId);
        } else {
          //console.log("OPERATION PERFORMED SUCCESSFULLY", operationId);
          onCompletion && onCompletion();
          resolve(operationId);
        }
      }, 0)
    );
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

describe("promisePool", () => {
  onCompletion = () => {
    succ_counter++;
  };
  onFail = () => {
    fail_counter++;
  };
  let succ_counter;
  let fail_counter;

  let preTest = test.do(() => {
    succ_counter = 0;
    fail_counter = 0;
  });

  preTest
    .stdout()
    .do(async () => {
      const operations = operationsListGenerator(100, 0.5);
      const stats = await promisePool(operations);
    })
    .it("should not log any errors", (output) => {
      expect(output.stdout).to.equal("");
    });

  preTest.it("should resolve all promises with 0 failRate", async () => {
    const operations = operationsListGenerator(100, 0);
    const stats = await promisePool(operations);
    expect(succ_counter)
      .to.equal(stats.successfull)
      .and.equal(operations.length);
    expect(fail_counter).to.equal(stats.retries).and.equal(0);
  });

  preTest.it("should complete all promises with >0 failRate", async () => {
    const operations = operationsListGenerator(100, 0.8);
    const stats = await promisePool(operations);
    expect(stats.successfull)
      .to.equal(succ_counter)
      .and.equal(operations.length);
    expect(stats.retries).to.equal(fail_counter).and.not.equal(0);
  });
});
