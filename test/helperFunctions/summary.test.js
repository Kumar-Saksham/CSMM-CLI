const { test, expect } = require("@oclif/test");
const summary = require("../../src/helperFunctions/summary");
const colors = require("ansi-colors");

describe("summary", () => {
  const completeStats = {
    total: 10,
    success: 8,
    fail: 2,
    warn: 1,
    successWrd: "successful",
    time: [1800216, 25],
  };

  test.it("should return complete summary", () => {
    expect(colors.unstyle(summary(completeStats)))
      .to.contain("8/10 successful")
      .and.contain("1 retry")
      .and.contain("2 failures")
      .and.contain("in 2w 6d 20h 3m 36s");
  });

  test.it("should return summary without retries", () => {
    const { warn, ...withoutWarn } = completeStats;
    expect(colors.unstyle(summary(withoutWarn)))
      .to.contain("8/10 successful")
      .and.contain("2 failures")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.not.contain(" retry ")
      .and.not.contain(" retries ");
  });

  test.it("should return summary without failures", () => {
    const { fail, ...withoutFail } = completeStats;
    expect(colors.unstyle(summary(withoutFail)))
      .to.contain("8/10 successful")
      .and.contain("1 retry")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.not.contain(" failure ")
      .and.not.contain(" failures ");
  });

  test.it("should return summary without either retries or failures", () => {
    const { warn, fail, ...withoutWarnAndFail } = completeStats;
    expect(colors.unstyle(summary(withoutWarnAndFail)))
      .to.contain("8/10 successful")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.not.contain(" retry ")
      .and.not.contain(" retries ")
      .and.not.contain(" failure ")
      .and.not.contain(" failures ");
  });

  test.it("should return summary without time", () => {
    const { time, ...withoutTime } = completeStats;
    expect(colors.unstyle(summary(withoutTime)))
      .to.contain("8/10 successful")
      .and.contain("retry")
      .and.contain("2 failures")
      .and.not.contain(" in ");
  });

  test.it("should use retry for single and retries for multiple", () => {
    const singleRetry = { ...completeStats, warn: 1 };
    expect(colors.unstyle(summary(singleRetry)))
      .to.contain("8/10 successful")
      .and.contain("2 failures")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("1 retry")
      .and.not.contain(" retries ");

    const multipleRetries = { ...completeStats, warn: 5 };
    expect(colors.unstyle(summary(multipleRetries)))
      .to.contain("8/10 successful")
      .and.contain("2 failures")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("5 retries")
      .and.not.contain(" retry ");

    const zeroRetries = { ...completeStats, warn: 0 };
    expect(colors.unstyle(summary(zeroRetries)))
      .to.contain("8/10 successful")
      .and.contain("2 failures")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("0 retries")
      .and.not.contain(" retry ");
  });

  test.it("should use failure for single and failures for multiple", () => {
    const singleFailure = { ...completeStats, fail: 1 };
    expect(colors.unstyle(summary(singleFailure)))
      .to.contain("8/10 successful")
      .and.contain("1 retry")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("1 failure")
      .and.not.contain(" failures ");

    const multipleFailures = { ...completeStats, fail: 5 };
    expect(colors.unstyle(summary(multipleFailures)))
      .to.contain("8/10 successful")
      .and.contain("1 retry")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("5 failures")
      .and.not.contain(" failure ");

    const zeroFailures = { ...completeStats, fail: 0 };
    expect(colors.unstyle(summary(zeroFailures)))
      .to.contain("8/10 successful")
      .and.contain("1 retry")
      .and.contain("in 2w 6d 20h 3m 36s")
      .and.contain("0 failures")
      .and.not.contain(" failure ");
  });
});
