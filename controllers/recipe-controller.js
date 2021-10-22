const axios = require("axios");

module.exports.getRestaurantRecipes = async (body) => {
    body.apiKey = process.env.SPOON_API_KEY;
    
    const recipes = await axios.get('https://api.spoonacular.com/food/menuItems/search', {params: body});

    if (recipes) {
        return recipes.data;
    }
    else {
        return {}
    }
}

