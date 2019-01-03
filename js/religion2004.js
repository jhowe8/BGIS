var relpoints = $.ajax({
	url: "data/religion2004.geojson",
  	dataType: "json",
  	success: console.log("Religious points data successfully loaded."),
  	error: function (xhr) {
		alert(xhr.statusText)
  	}
})

var filterGroup = document.getElementById('filter-group');

var numToRel = {
	0.0: 'ReligiousManagement',
	1.0: 'Buddhism',
	3.0: 'Taoism',
	4.0: 'Islam',
	5.0: 'Christianity',
	9.0: 'Others'
}

$.when(relpoints).done(function() {
	//map.on('load', function () {
		map.addSource('relpoints', {
	        "type": "geojson",
	        "data": relpoints.responseJSON
	    });

	    relpoints.responseJSON.features.forEach(function(feature) {
	    	var idNum = feature.properties['TYPE'];
	        var engtype = numToRel[feature.properties['TYPE']];
	        var layerID = engtype;
	        if (idNum == 0.0 && layerID == 1.0 && layerID == 3.0 && layerID == 4.0 && layerID == 5.0 && layerID == 9.0) {
	        	console.log(idNum);
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
			                ['get', 'TYPE'],
			                0.0, '#800000',
			                1.0, '#FF0000',
			                3.0, '#A52A2A',
			                4.0, '#006C35',
			                5.0, '#FFD700',
			                9.0, '#3cb44b',
			                '#000075'
			            ],
				            'circle-stroke-width': 1.3,
				            'circle-stroke-color': "white"
		            },
		            "filter": ["==", "TYPE", idNum]
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