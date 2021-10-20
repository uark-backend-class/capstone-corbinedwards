function initMap() {
    const myLatlng = { lat: 36.053950, lng: -94.194576 }
    const circle = {center: myLatlng, radius: 11265}
    const map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 17,
    });
    const marker = new google.maps.Marker({
        position: myLatlng,
        map,
        title: "Click to zoom",
    });
    map.addListener("click", () => {
        console.log("Map Click");
    });

    let service = new google.maps.places.PlacesService(map);
    let request = {
        query: 'McDonald\'s',
        fields: ['name', 'geometry'],
        locationBias: circle
    };
    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
        }
    });

}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}