const moreButton = document.getElementById("more");
const recipeSelect = document.getElementById("recipe-select");
const menuItemSelect = document.getElementById("menu-item-select");
let map;
let getNextPage;
let currentRecipes = [];

class SpoonacularRecipe {
    constructor(id, name, summary, steps) {
        this.id = id;
        this.name = name;
        this.summary = summary;
        
        if(steps.length > 0) {
            this.steps = steps[0].steps;
        }
        else {
            this.steps = [];
        }
    }
}

function initMap() {
    const myLatlng = { lat: 36.053950, lng: -94.194576 }

    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 17,
    });

    moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) {
          getNextPage();
        }
    };

    let request = {
        location: myLatlng,
        radius: '11265',
        type: ['restaurant']
    };

    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, searchCallback);
}

function searchCallback(results, status, pagination) {
    if (status !== "OK" || !results) return;
    
    const restaurantList = document.getElementById("restaurants");
    const restaurants = results.sort((a, b) => (a.name >= b.name) ? 1 : -1);
    
    for (const restaurant of restaurants) {
        if (restaurant.geometry && restaurant.geometry.location && !document.getElementById(restaurant.name)) {
          
            new google.maps.Marker({
                map,
                title: restaurant.name,
                position: restaurant.geometry.location,
            });
          
            const li = document.createElement("li");
            
            li.id = restaurant.name;
            li.className = "app-item-option"
            li.textContent = restaurant.name;
            restaurantList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(restaurant.geometry.location);
                loadMenuItems(restaurant.name).then(console.log(`Loaded ${restaurant.name} Menu Items`));
            });
        }
    }

    moreButton.disabled = !pagination || !pagination.hasNextPage;
    
    if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
    }
}

async function loadMenuItems(restaurantName) {
    menuItemSelect.textContent = "Loading...";
    recipeSelect.textContent = "";
    currentRecipes = [];

    let menuItems = await reqAppItems({ type: "MenuItem", params: { query: restaurantName, number: 10 } });
    menuItemSelect.textContent = "";

    if (!menuItems.menuItems) {
        // TODO: query mongo for restaurant items
        // TODO: if no mongo restaurants, offer to add
        return {}
    }
    
    for(const item of menuItems.menuItems) {
        const li = document.createElement("li");

        li.id = item.title;
        li.className = "app-item-option"
        li.textContent = item.title;
        menuItemSelect.appendChild(li);
        li.addEventListener("click", () => {
            loadRecipes(parseRecipeQuery(item.title)).then(console.log("Loaded Recipes"));
        });
    }
}

async function loadRecipes(queryStr) {
    recipeSelect.textContent = "Loading...";
    currentRecipes = [];

    const recipes = await reqAppItems({ type: "Recipes", params: { query: queryStr, addRecipeInformation: "true", number: 5 } });
    let recipeIndex = 0;

    recipeSelect.textContent = "";

    if (!recipes.results) return {}

    for(const recipe of recipes.results) {
        const li = document.createElement("li");
        const addLink = document.createElement("a");
        const recipeID = recipe.title.replace(" ", "-");
        const newRecipes = new SpoonacularRecipe(recipe.id, recipe.title, recipe.summary, recipe.analyzedInstructions);
        const currentRecipeIndex = recipeIndex;

        currentRecipes.push(newRecipes);

        li.id = recipeID;
        li.className = "app-item-option"
        li.textContent = recipe.title;

        addLink.id = recipeID + "-link";
        addLink.style = "float:right;";
        addLink.textContent = "Add";
        addLink.addEventListener("click", () => {
            addUserRecipe(currentRecipes[currentRecipeIndex])
            .then(addLink.textContent = "Added!")
            .catch(err => console.log(err));
        });

        li.appendChild(addLink);
        recipeSelect.appendChild(li);
        
        recipeIndex += 1;
    }
}

async function reqAppItems(data = {}) {
    const res = await fetch("/app", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function addUserRecipe(recipe) {
    const res = await fetch("/app", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    });
    return res.json();
}

function parseRecipeQuery(str) {
    let newStr = str;
    newStr = newStr.toLowerCase();
    newStr = newStr.replace("&", "and");
    newStr = newStr.replace(/\s*the\s*/, "");
    newStr = newStr.trim();

    return newStr.split(/\s*(-|--)\s*/)[0];
}