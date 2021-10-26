import { initMap } from './map.js';

let markers = [];

function placeMarkerAndPanTo(latLng, map) {
    const newMarker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    markers.forEach(m => m.setMap(null));
    markers.length = 0;
    markers.push(newMarker);

    map.panTo(latLng);
}

map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
});