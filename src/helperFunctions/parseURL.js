const urlDetails = url => {
  const host = url.slice(url.indexOf("://") + 3, url.indexOf(".com") + 4);
  const protocol = url.slice(0, url.indexOf(":") + 1);
  const path = url.slice(url.indexOf(".com") + 4);
  const port = 443;
  const filename = url.slice(url.lastIndexOf("/") + 1);
  const id = filename.match(/^([0-9]+)/)[0];
  const extension = filename.match(/(.[a-zA-Z]+)$/)[0];

  const options = {
    host,
    protocol,
    path,
    port,
    filename,
    id,
    extension
  };
  return options;
};

module.exports = urlDetails;
