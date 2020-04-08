const logUpdate = require("log-update");
const colors = require("ansi-colors");
const figures = require("figures");
const termSize = require("term-size");
const stringLength = require("string-length");

const states = {
	start: "START",
	grabLink: "GRAB_DOWNLOAD_LINK",
	download: "DOWNLOAD",
	install: "INSTALL",
	success: "SUCCESS",
	fail: "FAIL"
};

class Logger {
	constructor() {
		this.actives = {};
		this.log = logUpdate.create(process.stderr, { showCursor: false });
		this.previousOutput = "";
		this.marginWidth = termSize().columns;
		this.barWidth = 50;
		this.successfullyCompleted = 0;
	}

	get renderText() {
		const itemsToRender = Object.values(this.actives);

		const successCounter = `${colors.yellow(
			` [${this.successfullyCompleted}]`
		)}`;

		const margin = `${colors.dim(
			"━".repeat(this.marginWidth - stringLength(successCounter))
		)}${successCounter}`;

		return `${margin}\n${itemsToRender
			.map(item => this.style[item.state](item))
			.join("\n")}`;
	}

	style = {
		START: item => `${item.title}: STARTING...`,
		GRAB_DOWNLOAD_LINK: item => `${item.title}: GRABBING DOWNLOAD LINK...`,
		DOWNLOAD: item => {
			return `${item.title}: |${colors.green(
				"#".repeat(item.progress)
			)}${colors.dim("-".repeat(this.barWidth - item.progress))}|`;
		},
		INSTALL: item => `${item.title}: INSTALLING...`,
		SUCCESS: item => `${item.title} ${colors.green(figures.tick)}`,
		FAIL: item => `${item.title} ${colors.red(figures.cross)} ${item.message}`
	};

	insert(item) {
		this.actives[item.id] = {
			title: item.title,
			state: states.start,
			progress: 0,
			message: ""
		};
		this.render();
	}

	remove(id, finalState) {
		const itemToDelete = this.actives[id];
		delete this.actives[id];
		this.log.clear();
		this.log.done();
		console.log(this.style[finalState](itemToDelete));
	}

	update(id, state, progress, message = "") {
		const itemToUpdate = this.actives[id];
		if (state === states.fail || state === states.success) {
			if (state === states.success) {
				this.successfullyCompleted++;
			}
			itemToUpdate.message = message;
			this.remove(id, state);
		}
		itemToUpdate.state = state;
		if (progress) {
			const newProgressValue = Math.floor(progress * this.barWidth);
			if (newProgressValue === itemToUpdate.progress) {
				return;
			}
			itemToUpdate.progress = newProgressValue;
		}
		this.render();
	}

	render() {
		const output = this.renderText;
		this.log(output);
		this.previousOutput = output;
	}
}

module.exports = Logger;
module.exports.states = states;
