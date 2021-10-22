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
    
    // map.addListener("click", () => {
    //     console.log("Map Click");
    // });

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
    
    // console.log(results);
    
    const restaurantList = document.getElementById("restaurants");
    
    const restaurants = results.sort((a, b) => (a.name >= b.name) ? 1 : -1);
    console.log(restaurants);
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

// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location) return;
    
//     const marker = new google.maps.Marker({
//         map,
//         position: place.geometry.location,
//     });
    
// }