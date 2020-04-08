const path = require("path");
const categories = require("../../helperFunctions/categories");

const categoryLocation = category => {
  const locations = {
    MODS: path.join(__savesDirectory, "Addons/Mods/"),
    MAP_THEMES: path.join(__savesDirectory, "Addons/MapThemes/"),
    MAPS: path.join(__savesDirectory, "Maps"),
    ASSETS: path.join(__savesDirectory, "Addons/Assets/"),
    SAVEGAMES: path.join(__savesDirectory, "Saves/"),
    SCENARIOS: path.join(__savesDirectory, "Scenarios/"),
    STYLES: path.join(__savesDirectory, "Addons/styles/")
  };

  return locations[categories[category].class];
};

module.exports = categoryLocation;
