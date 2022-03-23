var pluralize = require("pluralize");
module.exports = {
  makeCapital: function (name, removespace, removeunderscore) {
    if (!name) return "";

    if (removeunderscore) name = name.split("_").join(" ");

    if (typeof name != "string") return "";
    if (removespace)
      return name
        .split(" ")
        .map((item) => {
          return item[0] ? item[0].toUpperCase() + "" + item.substr(1) : item;
        })
        .join("");
    else
      return name
        .split(" ")
        .map((item) => {
          return item[0] ? item[0].toUpperCase() + "" + item.substr(1) : item;
        })
        .join(" ");
  },
  makeLowerCase: function (name, removespace) {
    if (!name) return "";

    if (removespace)
      return name
        .split(" ")
        .map((item) => {
          return item.toLowerCase();
        })
        .join("");
    else
      return name
        .split(" ")
        .map((item) => {
          return item.toLowerCase();
        })
        .join(" ");
  },
  makeUpperCase: function (name, removespace) {
    if (!name) return "";

    if (removespace)
      return name
        .split(" ")
        .map((item) => {
          return item.toUpperCase();
        })
        .join("");
    else
      return name
        .split(" ")
        .map((item) => {
          return item.toUpperCase();
        })
        .join(" ");
  },
  removeUnderscore: function (name) {
    if (!name) return "";

    if (name) return name.split("_").join(" ");
    return name;
  },
  makeSingular: function (name) {
    if (!name) return "";

    return pluralize.singular(name);
  },
  makePluralize: function (name) {
    if (!name) return "";

    return pluralize(name);
  },
  makeCamelCase: function (name) {
    if (!name) return "";

    return name
      .split(" ")
      .map((item, ind) => {
        return ind && item[0]
          ? item[0].toUpperCase() + "" + item.substr(1)
          : item;
      })
      .join("");
  },
};
