const { test, expect } = require("@oclif/test");
const categoryLocation = require("../../../src/operations/install/categoryLocation");

describe("categoryLocation", () => {
  const possibleCategories = {
    Map: "./Maps",
    Mod: "./Addons/Mods/",
    SaveGame: "./Saves/",
    "District Style": "./Addons/styles/",
    "Map Theme": "./Addons/MapThemes/",
    Scenario: "./Scenarios/",
    Building: "./Addons/Assets/",
    Prop: "./Addons/Assets/",
    Tree: "./Addons/Assets/",
    Vehicle: "./Addons/Assets/",
    Intersection: "./Addons/Assets/",
    Park: "./Addons/Assets/",
    Electricity: "./Addons/Assets/",
    "Water & Sewage": "./Addons/Assets/",
    Garbage: "./Addons/Assets/",
    Healthcare: "./Addons/Assets/",
    Deathcare: "./Addons/Assets/",
    "Fire Department": "./Addons/Assets/",
    "Police Department": "./Addons/Assets/",
    Education: "./Addons/Assets/",
    Transport: "./Addons/Assets/",
    "Transport Bus": "./Addons/Assets/",
    "Transport Metro": "./Addons/Assets/",
    "Transport Train": "./Addons/Assets/",
    "Transport Ship": "./Addons/Assets/",
    "Transport Plane": "./Addons/Assets/",
    "Unique Building": "./Addons/Assets/",
    Monument: "./Addons/Assets/",
    Residential: "./Addons/Assets/",
    "Residential Low": "./Addons/Assets/",
    "Residential High": "./Addons/Assets/",
    Commercial: "./Addons/Assets/",
    "Commercial Low": "./Addons/Assets/",
    "Commercial High": "./Addons/Assets/",
    "Commercial Tourism": "./Addons/Assets/",
    "Commercial Leisure": "./Addons/Assets/",
    Industrial: "./Addons/Assets/",
    "Industrial Generic": "./Addons/Assets/",
    "Industrial Farming": "./Addons/Assets/",
    "Industrial Ore": "./Addons/Assets/",
    "Industrial Oil": "./Addons/Assets/",
    "Industrial Forestry": "./Addons/Assets/",
    Office: "./Addons/Assets/",
    "Transport Taxi": "./Addons/Assets/",
    "Transport Tram": "./Addons/Assets/",
    "Transport Monorail": "./Addons/Assets/",
    "Transport Cable Car": "./Addons/Assets/",
    Citizen: "./Addons/Assets/",
    Road: "./Addons/Assets/",
    "Park Area": "./Addons/Assets/",
    "Industry Area": "./Addons/Assets/",
    "Industry Area Farming": "./Addons/Assets/",
    "Industry Area Forestry": "./Addons/Assets/",
    "Industry Area Oil": "./Addons/Assets/",
    "Industry Area Ore": "./Addons/Assets/",
    "Unique Factory": "./Addons/Assets/",
    Campus: "./Addons/Assets/",
    "Campus Area": "./Addons/Assets/",
    "Campus Trade School": "./Addons/Assets/",
    "Campus Liberal Arts College": "./Addons/Assets/",
    "Campus University": "./Addons/Assets/",
    "Varsity Sports": "./Addons/Assets/",
    "Color Correction LUT": "./Addons/Assets/",
    "Cinematic Cameras": "./Addons/Mods/",
    Uncategorized: "./Addons/Assets/",
  };

  test
    .do(() => {
      for (category of Object.keys(possibleCategories)) {
        categoryLocation(category);
      }
    })
    .catch("", { raiseIfNotThrown: false })
    .it("should not throw error for any valid category");

  test.it("should give valid relative paths for respective category", () => {
    for (category in possibleCategories) {
      if (possibleCategories.hasOwnProperty(category))
        expect(categoryLocation(category)).to.equal(
          possibleCategories[category]
        );
    }
  });
});
