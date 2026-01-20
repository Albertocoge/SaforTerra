const hbs = require("hbs");

const CATEGORIES = require('../data/categories')

hbs.registerPartials(__dirname + "/../views/partials");

hbs.registerHelper("isSelected", function (id, cast, options) {
  // Verifica si el id está en el array cast
  if (cast.includes(id)) {
    return "selected";
  }
  
  return "";
});

// Dado un value del array, queremos encontrar el label para pintarlo bonito
hbs.registerHelper("getCategoryLabel", function (category, cast, options) {
  const categoryFound = CATEGORIES.find(arrCategory => arrCategory.value === category)
  return categoryFound.label || "";
});