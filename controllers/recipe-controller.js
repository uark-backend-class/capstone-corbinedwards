const axios = require("axios");

module.exports.getMenuItems = async (params) => {
    params.apiKey = process.env.SPOON_API_KEY;
    
    const menuItems = await axios.get('https://api.spoonacular.com/food/menuItems/search', {params: params});

    if (menuItems) {
        return menuItems.data;
    }
    else {
        return {};
    }
}

module.exports.getRecipeItems = async (params) => {
    params.apiKey = process.env.SPOON_API_KEY;

    const recipeItems = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: params});

    if (recipeItems) {
        return recipeItems.data;
    }
    else {
        return {};
    }
}