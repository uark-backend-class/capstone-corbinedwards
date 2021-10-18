module.exports.initMap = () => {
    const myLatlng = { lat: -25.363, lng: 131.044 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: myLatlng,
    });
    const colorDiv = document.getElementById("colorDiv");
    const marker = new google.maps.Marker({
      position: myLatlng,
      map,
      title: "Click to zoom",
    });
    console.log(marker);
    // map.addListener("center_changed", () => {
    //   // 3 seconds after the center of the map has changed, pan back to the
    //   // marker.
    //   window.setTimeout(() => {
    //     map.panTo(marker.getPosition());
    //   }, 3000);
    // });
    marker.addListener("click", () => {
      colorDiv.style.background="red";
        map.setZoom(8);
      map.setCenter(marker.getPosition());
    });
}