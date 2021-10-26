const form = document.getElementById("restaurantEdit");
const ulMenuItems = document.getElementById("menu-items");
const addButton = document.getElementById("add-menu-item");
const latSaved = Number(document.getElementById("lat").getAttribute("value"));
const lngSaved = Number(document.getElementById("lng").getAttribute("value"));
let map;
let markers = [];

function initMap() {
    const lat = (latSaved && latSaved !== "") ? latSaved : 36.053950;
    const lng = (lngSaved && lngSaved !== "") ? lngSaved : -94.194576;
    const myLatlng = { lat: lat, lng: lng }

    // initialize map
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 17,
    });

    // add marker at start location
    const newMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
    });
    markers.push(newMarker);

    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map);
    });

    return map;
}

// place single marker on map where user clicked and update form fields accordingly
function placeMarkerAndPanTo(latLng, map) {
    const newMarker = new google.maps.Marker({
        position: latLng,
        map: map,
    });
    const latField = document.getElementById("lat");
    const lngField = document.getElementById("lng");
    latField.setAttribute("value", latLng.lat());
    lngField.setAttribute("value", latLng.lng());

    markers.forEach(m => m.setMap(null));
    markers.length = 0;
    markers.push(newMarker);

    map.panTo(latLng);
}

function removeMenuItem(e) {
    if(ulMenuItems.children.length > 1) e.target.parentNode.remove();
}

function updateListEvents() {
    const removeLinks = document.querySelectorAll("ul > li > a");

    removeLinks.forEach((l) => {
        l.removeEventListener("click", removeMenuItem);
        l.addEventListener("click", removeMenuItem);
    });
}

// aggregate menu item values into one string for the request body
form.addEventListener("submit", () => {
    const menuItemsField = document.getElementById("menuItemsField");
    const menuItems = document.querySelectorAll("ul > li > input");
    let menuItemsString = "";

    menuItems.forEach((it) => {
        if (it.value === "") {
            // do nothing
        }
        else if(menuItemsString === "") {
            menuItemsString += it.value;
        }
        else {
            menuItemsString += "," + it.value;
        }
    });
    menuItemsField.setAttribute("value", menuItemsString);
});

addButton.addEventListener("click", () => {
    ulMenuItems.insertAdjacentHTML('beforeend', '<li><input type="text" value=""} /><a href="#">Remove</a></li>');
    updateListEvents();
});

updateListEvents();