const old_categories = {
  BUILDING: { name: "BUILDING", class: "ASSETS" },
  CAMPUS: { name: "CAMPUS", class: "ASSETS" },
  CAMPUS_AREA: { name: "CAMPUS AREA", class: "ASSETS" },
  CAMPUS_UNIVERSITY: { name: "CAMPUS UNIVERSITY", class: "ASSETS" },
  CINEMATIC_CAMERAS: { name: "CINEMATIC CAMERAS", class: "MODS" },
  CITIZEN: { name: "CITIZEN", class: "ASSETS" },
  COLLECTIONS: { name: "COLLECTIONS", class: "ASSETS" },
  COLOR_CORRECTION_LUT: { name: "COLOR CORRECTION LUT", class: "ASSETS" },
  COMMERCIAL: { name: "COMMERCIAL", class: "ASSETS" },
  COMMERCIAL_HIGH: { name: "COMMERCIAL HIGH", class: "ASSETS" },
  COMMERCIAL_LEISURE: { name: "COMMERCIAL LEISURE", class: "ASSETS" },
  COMMERCIAL_LOW: { name: "COMMERCIAL LOW", class: "ASSETS" },
  COMMERCIAL_TOURISM: { name: "COMMERCIAL TOURISM", class: "ASSETS" },
  DEATHCARE: { name: "DEATHCARE", class: "ASSETS" },
  DISTRICT_STYLE: { name: "DISTRICT STYLE", class: "STYLES" },
  EDUCATION: { name: "EDUCATION", class: "ASSETS" },
  ELECTRICITY: { name: "ELECTRICITY", class: "ASSETS" },
  FIRE_DEPARTMENT: { name: "FIRE DEPARTMENT", class: "ASSETS" },
  GARBAGE: { name: "GARBAGE", class: "ASSETS" },
  HEALTHCARE: { name: "HEALTHCARE", class: "ASSETS" },
  INDUSTRIAL: { name: "INDUSTRIAL", class: "ASSETS" },
  INDUSTRIAL_FARMING: { name: "INDUSTRIAL FARMING", class: "ASSETS" },
  INDUSTRIAL_FORESTRY: { name: "INDUSTRIAL FORESTRY", class: "ASSETS" },
  INDUSTRIAL_GENERIC: { name: "INDUSTRIAL GENERIC", class: "ASSETS" },
  INDUSTRIAL_OIL: { name: "INDUSTRIAL OIL", class: "ASSETS" },
  INDUSTRIAL_ORE: { name: "INDUSTRIAL ORE", class: "ASSETS" },
  INDUSTRY_AREA: { name: "INDUSTRY AREA", class: "ASSETS" },
  INDUSTRY_AREA_FARMING: { name: "INDUSTRY AREA FARMING", class: "ASSETS" },
  INDUSTRY_AREA_FORESTRY: {
    name: "INDUSTRY AREA FORESTRY",
    class: "ASSETS",
  },
  INDUSTRY_AREA_OIL: { name: "INDUSTRY AREA OIL", class: "ASSETS" },
  INDUSTRY_AREA_ORE: { name: "INDUSTRY AREA ORE", class: "ASSETS" },
  INTERSECTION: { name: "INTERSECTION", class: "ASSETS" },
  MAP: { name: "MAP", class: "MAPS" },
  MAP_THEME: { name: "MAP THEME", class: "MAP_THEMES" },
  MOD: { name: "MOD", class: "MODS" },
  MONUMENT: { name: "MONUMENT", class: "ASSETS" },
  OFFICE: { name: "OFFICE", class: "ASSETS" },
  PARK: { name: "PARK", class: "ASSETS" },
  PARK_AREA: { name: "PARK AREA", class: "ASSETS" },
  POLICE_DEPARTMENT: { name: "POLICE DEPARTMENT", class: "ASSETS" },
  PROP: { name: "PROP", class: "ASSETS" },
  RESIDENTIAL: { name: "RESIDENTIAL", class: "ASSETS" },
  RESIDENTIAL_HIGH: { name: "RESIDENTIAL HIGH", class: "ASSETS" },
  RESIDENTIAL_LOW: { name: "RESIDENTIAL LOW", class: "ASSETS" },
  ROAD: { name: "ROAD", class: "ASSETS" },
  SAVEGAME: { name: "SAVEGAME", class: "SAVEGAMES" },
  SCENARIO: { name: "SCENARIO", class: "SCENARIOS" },
  TRANSPORT: { name: "TRANSPORT", class: "ASSETS" },
  TRANSPORT_BUS: { name: "TRANSPORT BUS", class: "ASSETS" },
  TRANSPORT_CABLE_CAR: { name: "TRANSPORT CABLE CAR", class: "ASSETS" },
  TRANSPORT_METRO: { name: "TRANSPORT METRO", class: "ASSETS" },
  TRANSPORT_MONORAIL: { name: "TRANSPORT MONORAIL", class: "ASSETS" },
  TRANSPORT_PLANE: { name: "TRANSPORT PLANE", class: "ASSETS" },
  TRANSPORT_SHIP: { name: "TRANSPORT SHIP", class: "ASSETS" },
  TRANSPORT_TAXI: { name: "TRANSPORT TAXI", class: "ASSETS" },
  TRANSPORT_TRAIN: { name: "TRANSPORT TRAIN", class: "ASSETS" },
  TRANSPORT_TRAM: { name: "TRANSPORT TRAM", class: "ASSETS" },
  TREE: { name: "TREE", class: "ASSETS" },
  UNCATEGORIZED: { name: "UNCATEGORIZED", class: "ASSETS" },
  UNIQUE_BUILDING: { name: "UNIQUE BUILDING", class: "ASSETS" },
  UNIQUE_FACTORY: { name: "UNIQUE FACTORY", class: "ASSETS" },
  VARSITY_SPORTS: { name: "VARSITY SPORTS", class: "ASSETS" },
  VEHICLE: { name: "VEHICLE", class: "ASSETS" },
  WATER_N_SEWAGE: { name: "WATER & SEWAGE", class: "ASSETS" },
};

const new_categories = (cat) => {
  switch (cat) {
    case "MAP":
      return "MAPS";
    case "MOD":
      return "MODS";
    case "SAVEGAME":
      return "SAVEGAMES";
    case "DISTRICT_STYLE":
      return "STYLES";
    case "MAP_THEME":
      return "MAP_THEMES";
    case "SCENARIO":
      return "SCENARIOS";
    case "COLOR_CORRECTION_LUT":
      return "ASSETS";
    case "CINEMATIC_CAMERAS":
      return "MODS";
    default:
      return "ASSETS";
  }
};

module.exports = new_categories;
module.exports.old_categories = old_categories;
