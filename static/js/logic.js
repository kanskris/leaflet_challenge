var API_KEY = "pk.eyJ1Ijoia2Fuc2tyaXMiLCJhIjoiY2s2bnU0NHRlMGc5azNqbXpubG05aDZueiJ9.pcMmAQvd-cAwJ1WKw1D1OQ";

// Creating map object
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
});
  
// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 11,
id: "mapbox.streets",
accessToken: API_KEY
}).addTo(myMap);
  
// Assemble API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, function(response) {
    //to be used with pointtolayer feature to provide radius, opacity, color etc for each quake
    function mystyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: plotColor(feature.properties.mag),
            color: "#000000",
            radius: plotCircle(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    //determine different colors
    function plotColor(magnitude) {
        switch (true) {
        case magnitude > 7:
        return "#b50b0e";
        case magnitude > 6:
        return "#b50b96";
        case magnitude > 5:
        return "#720fbd";
        case magnitude > 4:
        return "#0f1bbd";
        case magnitude > 3:
        return "#0f7abd";
        case magnitude > 2:
        return "#0a9133";
        case magnitude > 1:
        return "#9feb34";
        default:
        return "##e8eb34";
        }
    }

  function plotCircle(magnitude) {
    if (magnitude === 0) {
      return 0.5;
    }
    return magnitude * 3;
  }

  //using the l.geojson with pointtolayer and oneachfeature - refer the sections in the URL https://leafletjs.com/examples/geojson/
  L.geoJson(response, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mystyle,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>URL: "+feature.properties.url);
    }
  }).addTo(myMap);
});