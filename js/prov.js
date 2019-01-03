var hoveredStateId =  null;

var provpoly = $.ajax({
	//url: "data/rel2k4fraction.geojson",
  	url: "data/prov.geojson",
  	dataType: "json",
  	success: console.log("Province polygon data successfully loaded."),
  	error: function (xhr) {
		alert(xhr.statusText)
  	}
})

$.when(provpoly).done(function() {
	map.on('load', function () {
    	map.addSource('prov', {
            "type": "geojson",
            "data": provpoly.responseJSON
        });

        map.addLayer({
            "id": "prov-fill",
            "type": "fill",
            "source": "prov",
            "layout": {},
            'paint': {
            	"fill-color": "#627BC1",
                "fill-opacity": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    .5,
                    0.2
                ]
            }
    	});

    	map.addLayer({
            "id": "prov-border",
            "type": "line",
            "source": "prov",
            "layout": {},
            'paint': {
                "line-color": "#627BC1",
                "line-width": 2
            }
    	});

        
    	map.on('click', 'prov-fill', function (e) {
            //newWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");  
  
            //newWindow.document.write("<select onchange='window.opener.setValue(this.value);'>");

            //newWindow.document.write("</select>");

            var points = relpoints.responseJSON.features;
            console.log(e.features[0].properties.PROV_);
            console.log(e.features[0].properties.NAME);
            var pointsInThisProv = 0;

            for (var i = 0; i < points.length; i++) {
                if (points[i].properties.NAME == e.features[0].properties.NAME) {
                    pointsInThisProv += 1;
                }
            }

            console.log(pointsInThisProv);
    
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("ok??")
                .setHTML(e.features[0].properties.PROV_)
                .addTo(map);
        });
        

    	// Change the cursor to a pointer when the mouse is over the states layer.
        map.on('mousemove', 'prov-fill', function (e) {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState({source: 'prov', id: hoveredStateId}, { hover: false});
                }
                hoveredStateId = e.features[0].properties.PROV_;
                map.setFeatureState({source: 'prov', id: hoveredStateId}, { hover: true});
            }
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'prov-fill', function () {
        	if (hoveredStateId) {
                map.setFeatureState({source: 'prov', id: hoveredStateId}, { hover: false});
            }
            hoveredStateId =  null;
            map.getCanvas().style.cursor = '';
        });

        
        
    });
});

