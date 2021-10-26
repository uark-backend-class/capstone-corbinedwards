const axios = require("axios");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const RecipeStep = require("../models/recipeStep");
const RecipeIngredient = require("../models/recipeIngredient");

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

    let recipeItems = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: params});

    while(recipeItems.data && recipeItems.data.results.length === 0) {
        params.query = params.query.substring(0, params.query.lastIndexOf(" "));
        recipeItems = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: params});
    }

    if (recipeItems.data.results.length > 0) {
        return recipeItems.data;
    }
    else {
        return {};
    }
}

module.exports.addRecipe = async (user, data) => {
    if(user.recipes.find(r => r.spoonacularID === data.id)) return {};

    const newRecipe = new Recipe;
    const ingredients = [];
    const utensils = [];

    newRecipe.spoonacularID = data.id;
    newRecipe.name = data.title;
    newRecipe.summary = data.summary;

    for(const step of data.steps) {
        const newStep = new RecipeStep;
        newStep.number = step.number;
        newStep.instructions = step.step;

        step.ingredients.forEach(ingredient => {
            const newIngredient = new RecipeIngredient;
            newIngredient.spoonacularID = ingredient.id;
            newIngredient.name = ingredient.name;

            newStep.ingredients.push(newIngredient);
            if(ingredients.find(i => i.id === ingredient.id)) ingredients.push(newIngredient);
        });

        step.equipment.forEach(utensil => {
            if(utensils.find(u => u === utensil.name)) utensils.push(utensil.name);
        });

        newRecipe.steps.push(newStep);
    }

    newRecipe.ingredients = newRecipe.ingredients.concat(ingredients);
    newRecipe.utensils = newRecipe.utensils.concat(utensils);
    
    user.recipes.push(newRecipe);
    
    await user.save();
    return data;
}