var relpoints = $.ajax({
	//url: "data/religion2004.geojson",
  	url: "data/china_bgis_fme.json",
  	dataType: "json",
  	success: console.log("Religious points data successfully loaded."),
  	error: function (xhr) {
		alert(xhr.statusText)
  	}
})


var filterGroup = document.getElementById('filter-group');

$.when(relpoints).done(function() {
	//map.on('load', function () {
		map.addSource('relpoints', {
	        "type": "geojson",
	        "data": relpoints.responseJSON
	    });

	    relpoints.responseJSON.features.forEach(function(feature) {
	        var engtype = feature.properties['TYPE_ENG'];
	        var layerID = engtype;
	        if (layerID == "") {
	        	console.log("none found");
	        	layerID = "noone";
	        	engtype = "noone";
	        }
	        // Add a layer for this symbol type if it hasn't been added already.
	        if (!map.getLayer(layerID)) {
	            map.addLayer({
	                "id": layerID,
	                "type": "circle",
	                "source": "relpoints",
                	'paint': {
		            // make circles larger as the user zooms from z5 to z14
			            'circle-radius': {
			                'base': 1.5,
			                'stops': [[5, 4], [14, 80]]
			            },
			            // color circles by ethnicity, using a match expression
			            // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
			            'circle-color': [
			                'match',
			                ['get', 'TYPE_ENG'],
			                'Activity Point', '#800000',
			                'Shrine', '#42d4f4',
			                'association', '#fabebe',
			                'cave', '#808000',
			                'chapel', '#bfef45',
			                'hall', '#3cb44b',
			                'house', '#aaffc3',
			                'monastery', '#f58231',
			                'monastery1', '#ffffff',
			                'none', '#000075',
			                'others', '#911eb4',
			                'temple', '#f032e6',
			                'unknown', '#469990',
			                '#000075'
			            ],
				            'circle-stroke-width': 1.3,
				            'circle-stroke-color': "white"
		            },
		            "filter": ["==", "TYPE_ENG", engtype]
		        });

	            // Add checkbox and label elements for the layer.
	            var input = document.createElement('input');
	            input.type = 'checkbox';
	            input.id = layerID;
	            input.checked = true;
	            filterGroup.appendChild(input);

	            var label = document.createElement('label');
	            label.setAttribute('for', engtype);
	            label.textContent = engtype;
	            filterGroup.appendChild(label);

	            // When the checkbox changes, update the visibility of the layer.
	            input.addEventListener('change', function(e) {
	                map.setLayoutProperty(engtype, 'visibility',
	                    e.target.checked ? 'visible' : 'none');
	            });
	        }
	    });	
	});
//});	

var relEngTypes = ['monastery', 'association', 'others', 'chapel', 'house', 'cave', 'temple', 'unknown', 'none', 'hall', 'monastery1', 'Activity Point', 'Shrine'];

//map.on('load', function () {
	for (var i = 0; i < relEngTypes.length; i++) {
	// CLICK POINTS, SHOW PROPERTIES
		map.on('click', relEngTypes[i], function(e) {
		  	var coordinates = e.features[0].geometry.coordinates.slice();
	        var description = '<div class="ptable"> <TABLE>' +
	        	"<TR> <TD>OBJECTID</TD>" + "<TD>" + e.features[0].properties.OBJECTID + "</TD>" + 
	        	"<TR> <TD>BGIS_ID</TD>" + "<TD>" + e.features[0].properties.BGIS_ID + "</TD>" + 
	        	"<TR> <TD>NM_ENG</TD>" + "<TD>" + e.features[0].properties.NM_ENG + "</TD>" + 
	        	"<TR> <TD>NM_HZ</TD>" + "<TD>" + e.features[0].properties.NM_HZ + "</TD>" + 
	        	"<TR> <TD>TYPE_ENG</TD>" + "<TD>" + e.features[0].properties.TYPE_ENG + "</TD>" + 
	        	"<TR> <TD>TYPE_HZ</TD>" + "<TD>" + e.features[0].properties.TYPE_HZ + "</TD>" + 
	        	"<TR> <TD>POSTCODE</TD>" + "<TD>" + e.features[0].properties.POSTCODE + "</TD>" + 
	        	"<TR> <TD>SRC_HZ</TD>" + "<TD>" + e.features[0].properties.SRC_HZ + "</TD>" + 
	        	"<TR> <TD>LAT</TD>" + "<TD>" + e.features[0].properties.LAT + "</TD>" + 
	        	"<TR> <TD>LONG</TD>" + "<TD>" + e.features[0].properties.LONG + "</TD>" + 
	        	"<TR> <TD>VERSION</TD>" + "<TD>" + e.features[0].properties.VERSION + "</TD>" +
	        	"<TR> <TD>GB_PRV_99</TD>" + "<TD>" + e.features[0].properties.GB_PRV_99 + "</TD>" +
	        	"<TR> <TD>PROV_PY</TD>" + "<TD>" + e.features[0].properties.PROV_PY + "</TD>" +
	        	"<TR> <TD>PROV_HZ</TD>" + "<TD>" + e.features[0].properties.PROV_HZ + "</TD>" +
	        	"<TR> <TD>A1_PY_99</TD>" + "<TD>" + e.features[0].properties.A1_PY_99 + "</TD>" +
	        	"<TR> <TD>A2_PY_99</TD>" + "<TD>" + e.features[0].properties.A2_PY_99 + "</TD>" +
	        	"<TR> <TD>A3_PY_99</TD>" + "<TD>" + e.features[0].properties.A3_PY_99 + "</TD>" +
	        	"<TR> <TD>GB_CTY_99</TD>" + "<TD>" + e.features[0].properties.GB_CTY_99 + "</TD> </TABLE> </div>";
	        // Ensure that if the map is zoomed out such that multiple
	        // copies of the feature are visible, the popup appears
	        // over the copy being pointed to.
	        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
	            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
	        }

	        new mapboxgl.Popup()
	            .setLngLat(coordinates)
	            .setHTML(description)
	            .addTo(map);
	    });

	    // Change the cursor to a pointer when the mouse is over the places layer.
	    map.on('mouseenter', relEngTypes[i], function () {
	        map.getCanvas().style.cursor = 'pointer';
	    });

	    // Change it back to a pointer when it leaves.
	    map.on('mouseleave', relEngTypes[i], function () {
	        map.getCanvas().style.cursor = '';
	    });
	}
//});