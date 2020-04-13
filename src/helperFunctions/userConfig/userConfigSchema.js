module.exports = {
  path: {
    type: "object",
    properties: {
      saveDir: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      tmpDir: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
    },
    required: ["saveDir", "tmpDir"],
  },
  process: {
    type: "object",
    properties: {
      concurrency: {
        type: "integer",
        minimum: 1,
        maximum: 9,
      },
      transferProgressTimeout: {
        type: "integer",
        minimum: 5000,
      },
    },
    required: ["concurrency", "transferProgressTimeout"],
  },
};
