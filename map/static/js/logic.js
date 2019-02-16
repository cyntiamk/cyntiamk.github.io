// Store our API endpoint inside queryUrl
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var faultUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json";

var earthquakesData =  d3.json(earthquakeUrl, function(data) {
var faultLineData = d3.json(faultUrl, function (faultData) {
  console.log(data);
  console.log(faultData);

function getColor(d) {
    return d > 7 ? '#800026' :
           d > 6 ? '#BD0026' :
           d > 5 ? '#E31A1C' :
           d > 4 ? '#FC4E2A' :
           d > 3 ? '#FD8D3C' :
           d > 2 ? '#FEB24C' :
           d > 1 ? '#FED976' :
                   '#FFEDA0';
}

function eStyle(feature) {
    return {
        fillColor: getColor(feature.properties.mag),
        weight: 0.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7,
        radius: 3*feature.properties.mag
    };
}

var earthquakes = L.geoJson(data, {
  pointToLayer: function (feature, latlngs) {
    return L.circleMarker(latlngs, eStyle(feature))
    .bindPopup("<p>Location: " + feature.properties.place + "</p><hr><p> Magnitude: "+feature.properties.mag+"</p>");
  }
});
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

var fStyle = {
  color: 'red',
  weight: 1
};
var faultLines = L.geoJson(faultData, {
  function (feature, latlngs) {
    return L.polygon(latlngs, {style: fStyle});
  }
});
var baseMaps = {
  "Grayscale": lightmap,
  "Satellite": satellite,
  "Outdoors": outdoors
};

var overlayMaps = {
  "Earthquakes": earthquakes,
  "Fault Lines": faultLines
};

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });


L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


});
});
