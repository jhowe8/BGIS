var mapstyleLayerList = document.getElementById('mapstyle');
var inputs = mapstyleLayerList.getElementsByTagName('button');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.remove();
    map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/' + layerId + '-v9',
		zoom: 3,
    	center: [103.452083, 35.844694]
	});
    map.on('load', function () {
		map.addSource('BGIS', {
	        "type": "geojson",
	        "data": "data/china_bgis_fme.json"
	    });
	    map.addLayer({
	        "id": "points",
	        "type": "circle",
	        "source": "BGIS",
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
	                'unknown', '#42d4f4',
	                '#000075'
	            ]
	    	}
		});
	});
}


for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}