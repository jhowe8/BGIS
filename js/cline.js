var countyline = $.ajax({
	//url: "data/rel2k4fraction.geojson",
  	url: "data/cline.geojson",
  	dataType: "json",
  	success: console.log("County line data successfully loaded."),
  	error: function (xhr) {
		alert(xhr.statusText)
  	}
})

$.when(countyline).done(function() {
	//map.on('load', function () {
		map.addSource('county', {
	        "type": "geojson",
	        "data": countyline.responseJSON
	    });

	    map.addLayer({
	        "id": "counties",
	        "type": "fill",
	        "source": "county",
	        "layout": {},
	        //"layout": {
	        //	"line-join": "round",
	        //	"line-cap": "round"
	        //},
	        "paint": {
		        "fill-color": "#627BC1",
	            "fill-opacity": 0.8
            }
	        //'paint': {
	        //	'line-color': 'black',
	        //	'line-width': 0.8
	        //}
    	});
	});
//});

map.on('click', 'counties', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.CLINE_ID)
            .addTo(map);
    });

// Change the cursor to a pointer when the mouse is over the states layer.
map.on('mousemove', 'counties', function (e) {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'prov-fill', function () {
    map.getCanvas().style.cursor = '';
});


