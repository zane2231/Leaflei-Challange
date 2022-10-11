//url for earthquake website
//using the month total earthquake url enough data
let geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//this function generates map and legends
function createMaps(earthquakeMarkers) {
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        
    let myMap = L.map("map", {
        center: [38, -100],
        zoom: 5,
        layers: [streetMap, earthquakeMarkers]
    });
    
    //legend with color matching group
    let legend = L.control({position:"bottomright"});

    //adding the color squares
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend")
        div.innerHTML += '<i style="background: #a3f600"></i><span><10</span><br>';
        div.innerHTML += '<i style="background: #dcf400"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #f7db11"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #fdb72a"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #fca35d"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #ff5f65"></i><span>90<</span><br>';
        return div
    };
    legend.addTo(myMap);
};

//creating and coloring the circles
function createMarkers(data) {
    function depthColor(depthCoord) {
        let color = ""
        if (depthCoord < 10) {color = "#a3f600"}
        else if (depthCoord < 30) {color = "#dcf400"}
        else if (depthCoord < 50) {color = "#f7db11"}
        else if (depthCoord < 70) {color = "#fdb72a"}
        else if (depthCoord < 90) {color = "#fca35d"}
        else {color = "#ff5f65"}
        return color
    };

    //creating pop up with additional information for when the user click on the circle marker
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>Location: ${feature.properties.place}</h3>
            <hr><p>Date: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Latitude: ${feature.geometry.coordinates[0]}</p>
            <p>Longitude: ${feature.geometry.coordinates[1]}</p>
            <p>Depth: ${feature.geometry.coordinates[2]}</p>`
            )
    };

    //placing each marker on the layer
    let earthquakeMarkers = L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 2,
                fillOpacity: 0.8
            })
        }
    });

    createMaps(earthquakeMarkers);
};

//reading in the url for the geoData then calling the createmarkers function for the geoData
d3.json(geoURL).then(function(data) {
    createMarkers(data);
});