let map;
let service;
let getNextPage;
const moreButton = document.getElementById("more");

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

    service = new google.maps.places.PlacesService(map);
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
            li.className = "restaurant-option"
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
    const menuItemSelect = document.getElementById("menu-item-select");
    menuItemSelect.textContent = "Loading...";
    
    const menuItems = await reqMenuItem("/app", { type: "MenuItem", params: { query: restaurantName, number: 10 } });
    menuItemSelect.textContent = "";

    if (!menuItems.menuItems) return {}
    
    for(const item of menuItems.menuItems) {
        const li = document.createElement("li");
        
        li.id = item.title;
        li.className = "menu-item-option"
        li.textContent = item.title;
        menuItemSelect.appendChild(li);
        li.addEventListener("click", () => {
            loadRecipes().then(console.log("Loaded Recipes"));
        })
    }
}

async function loadRecipes() {
    return {};
}

async function reqMenuItem(url, data = {}) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}