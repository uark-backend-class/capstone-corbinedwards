const moreButton = document.getElementById("more");
const recipeSelect = document.getElementById("recipe-select");
const menuItemSelect = document.getElementById("menu-item-select");
const restaurantList = document.getElementById("restaurants");
let map;
let getNextPage;
let currentRestaurants = [];
let currentRecipes = [];

class Restaurant {
    constructor(name, location, menu) {
        this.name = name;
        this.menu = menu;
        this.location = {lat: 0, lng: 0};

        if(location.location) {
            this.location.lat = location.location.lat();
            this.location.lng = location.location.lng();
        }
        else {
            this.location.lat = Number(location.lat);
            this.location.lng = Number(location.lng);
        }
    }
}

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
        zoom: 18,
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
    loadRestaurants()
    .then(() => {
        if (status === "OK" && results) {
            const restaurants = results;
            restaurants.forEach((r) => {
                if(!currentRestaurants.find(cr => cr.name === r.name)) currentRestaurants.push(new Restaurant(r.name, r.geometry, []));
            });
        }

        setRestaurants();
    })
    .catch((err) => {
        console.log(err);
    });
    
    moreButton.disabled = !pagination || !pagination.hasNextPage;

    if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
            // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
        };
    }
}

async function loadRestaurants() {
    currentRestaurants = [];
    const savedRestaurants = await reqAppItems({ type: "Restaurants" });
    savedRestaurants.forEach((r) => currentRestaurants.push(new Restaurant(r.name, r.location, r.menu)));
}

async function loadMenuItems(restaurantName) {
    menuItemSelect.textContent = "Loading...";
    recipeSelect.textContent = "";
    currentRecipes = [];

    const restaurant = currentRestaurants.find(r => r.name === restaurantName);
    let menuItems;

    if (!restaurant || restaurant.menu.length === 0) {
        menuItems = await reqAppItems({ type: "MenuItem", params: { query: restaurantName, number: 10 } });
        
        if(menuItems) {
            menuItems = menuItems.menuItems.map(m => m.title);
        }
        else {
            menuItems = [];
        }
    }
    else {
        menuItems = restaurant.menu;
    }
    
    menuItemSelect.textContent = "";

    if (!menuItems) {
        // TODO: query mongo for restaurant items
        // TODO: if no mongo restaurants, offer to add
        return {}
    }

    for(const item of menuItems) {
        const li = document.createElement("li");

        li.id = item;
        li.className = "app-item-option"
        li.textContent = item;
        menuItemSelect.appendChild(li);
        li.addEventListener("click", () => {
            loadRecipes(parseRecipeQuery(item)).then(console.log("Loaded Recipes"));
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
    return res;
}

function parseRecipeQuery(str) {
    let newStr = str;
    newStr = newStr.toLowerCase();
    newStr = newStr.replace("&", "and");
    newStr = newStr.replace(/\s*the\s*/, "");
    newStr = newStr.trim();

    return newStr.split(/\s*(-|--)\s*/)[0];
}

function setRestaurants() {
    currentRestaurants = currentRestaurants.sort((a, b) => (a.name >= b.name) ? 1 : -1);
    
    for (const restaurant of currentRestaurants) {
        if (restaurant.location && !document.getElementById(restaurant.name)) {
            const li = document.createElement("li");

            new google.maps.Marker({
                map,
                title: restaurant.name,
                position: restaurant.location,
            });
            
            li.id = restaurant.name;
            li.className = "app-item-option"
            li.textContent = restaurant.name;
            restaurantList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(restaurant.location);
                loadMenuItems(restaurant.name).then(console.log(`Loaded ${restaurant.name} Menu Items`));
            });
        }
    }
}