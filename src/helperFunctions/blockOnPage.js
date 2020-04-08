const blockOnPage = async (browser, options = {}) => {
	const allow = {
		stylesheet: false,
		font: false,
		image: false,
		jpeg: false,
		png: false,
		media: false,
		script: false,
		...options
	};

	const blockList = Object.keys(allow).filter(key => !allow[key]);

	const page = await browser.newPage();
	page.setJavaScriptEnabled(allow.script);
	await page.setRequestInterception(true);
	await page.on("request", req => {
		if (blockList.includes(req.resourceType())) {
			req.abort();
		} else {
			req.continue();
		}
	});

	return page;
};

module.exports = blockOnPage;
