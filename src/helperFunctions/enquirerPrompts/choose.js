const { Select } = require("enquirer");

const choose = async (message, optionsObject) => {
  const choices = [];
  for (opt of Object.keys(optionsObject)) {
    const name = opt;
    const message = opt;
    let disabled = false;
    let hint = null;
    if (opt.includes("[REMOVED]")) {
      hint = "this might not download";
    }

    choices.push({ name, message, disabled, hint });
  }

  const prompt = new Select({
    name: "chooseOne",
    message,
    choices
  });

  const selectDefault = () => {
    if (!prompt.keypressed) {
      prompt.submit();
    }
  };
  let cursorIndex;
  const timer = setTimeout(selectDefault, 5000);

  const answer = await prompt.run();
  clearTimeout(timer);

  return await optionsObject[answer]();
};

module.exports = choose;
