module.exports = (url) => {
  let filename, id, extension;
  try {
    const pathname = new URL(url).pathname;
    const index = pathname.lastIndexOf("/");
    filename = -1 !== index ? pathname.substring(index + 1) : pathname;
    if (!filename.length) throw new Error("invalid filename");

    const possibleId = filename.match(/([0-9]+)/);
    id = possibleId && possibleId[0];

    const possibleExtension = filename.match(/(.[a-zA-Z]+)$/);
    extension = possibleExtension ? possibleExtension[0] : "";
  } catch(e) {
    filename = null;
    id = null;
    extension = null;
  }

  const options = {
    filename,
    id,
    extension,
  };
  return options;
};
