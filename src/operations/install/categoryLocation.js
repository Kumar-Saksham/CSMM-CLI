const path = require("path");
const categories = require("../../helperFunctions/categories");

const categoryLocation = category => {
  const locations = {
    MODS: path.join(__saveDir, "Addons/Mods/"),
    MAP_THEMES: path.join(__saveDir, "Addons/MapThemes/"),
    MAPS: path.join(__saveDir, "Maps"),
    ASSETS: path.join(__saveDir, "Addons/Assets/"),
    SAVEGAMES: path.join(__saveDir, "Saves/"),
    SCENARIOS: path.join(__saveDir, "Scenarios/"),
    STYLES: path.join(__saveDir, "Addons/styles/")
  };

  return locations[categories[category].class];
};

module.exports = categoryLocation;
