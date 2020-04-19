const path = require("path");
const getClass = require("../../helperFunctions/categories");

const safeNameConverter = (input) => {
  return input.trim().replace(/&/g, "N").replace(/ /g, "_").toUpperCase();
};

const categoryLocation = (category) => {
  category = safeNameConverter(category);
  const locations = {
    MODS: "./Addons/Mods/",
    MAP_THEMES: "./Addons/MapThemes/",
    MAPS: "./Maps",
    ASSETS: "./Addons/Assets/",
    SAVEGAMES: "./Saves/",
    SCENARIOS: "./Scenarios/",
    STYLES: "./Addons/styles/",
  };

  const ans = locations[getClass(category)];
  if (!ans) console.error(category);
  return ans;
};

module.exports = categoryLocation;
