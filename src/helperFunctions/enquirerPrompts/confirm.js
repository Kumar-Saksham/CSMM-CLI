const { Confirm } = require("enquirer");

const confirm = async question => {
	const prompt = new Confirm({
		name: "question",
		message: question
    });
	return await prompt.run();
};

module.exports = confirm;
