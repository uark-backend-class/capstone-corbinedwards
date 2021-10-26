let map;
let markers = [];

function initMap() {
    const myLatlng = { lat: 36.053950, lng: -94.194576 }

    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 17,
    });

    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map);
    });

    return map;
}

function placeMarkerAndPanTo(latLng, map) {
    const newMarker = new google.maps.Marker({
        position: latLng,
        map: map,
    });
    const latField = document.getElementById("lat");
    const lngField = document.getElementById("lng");
    console.log(latLng.lat);
    latField.setAttribute("value", latLng.lat);
    lngField.setAttribute("value", latLng.lng);

    console.log(latField.getAttribute("value"));

    markers.forEach(m => m.setMap(null));
    markers.length = 0;
    markers.push(newMarker);

    map.panTo(latLng);
}