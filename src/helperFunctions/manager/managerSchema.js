module.exports = {
  name: {
    title: "Manager Name",
    description: "Name to identify manager file",
    type: "string",
    maxLength: 64,
    minLength: 2,
    default: "CSMM_DEFAULT"
  },
  description: {
    title: "Description Text",
    description: "Text to describe the manager file",
    type: "string",
    maxLength: 255,
    minLength: 0,
    default: ""
  },
  installed: {
    title: "Installed items",
    description: "List of all items installed currently",
    type: "object",
    patternProperties: {
      "[0-9]+": {
        title: "Item",
        description: "Metadata about installed item",
        type: "object",
        properties: {
          title: {
            title: "Item Name",
            description: "Name of the installed item",
            type: "string",
            maxLength: 255,
            minLength: 2
          },
          updated: {
            title: "Update Date",
            description: "Date item was last updated on steam",
            type: "string",
            format: "date-time"
          },
          location: {
            title: "Install Location",
            description: "location of item after installation",
            type: "string",
            pattern: "(([A-Z]):)?((\\/|\\\\)[0-9a-zA-Z_\\-\\ ]+)+"
          },
          id: {
            title: "ItemID",
            description: "Unique identifier for item",
            type: "string",
            pattern: "[0-9]+"
          }
        },
        required: ["title", "updated", "location", "id"]
      }
    },
    default: {}
  }
  //},
  //required: ["name", "description", "installed"]
};
