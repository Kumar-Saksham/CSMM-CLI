class Err extends Error {
	constructor(message, type, ...rest) {
		super(message, rest);
		this.type = type;
	}
}

module.exports = Err;
