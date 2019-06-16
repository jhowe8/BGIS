var numToRel = {
	0.0: 'ReligiousManagement',
	1.0: 'Buddhism',
	3.0: 'Taoism',
	4.0: 'Islam',
	5.0: 'Christianity',
	9.0: 'Others'
}

/* // only used to find out min and max year of properties.STARTYEAR
function uniqueYears(year, years) {
	var intYear = parseInt(year, 10);
	for (i = 0; i < years.length; i++) {
    	if (years[i] == intYear) {
        	return;
    	}
	}
    years.push(intYear);
}
*/
// set the current filter year on slider
var year = 2004;
var years = [];

for(var i = 210; i <= 2004; i++) {
	years.push(i);
}

var reltypes = ['Buddhism', 'Christianity', 'Taoism', 'Islam', 'ReligiousManagement', 'Others'];

function filterBy(year) {
	for (i = 0; i < reltypes.length; i++) {
		map.setFilter(reltypes[i], ['all', ['<=', 'year', year], ["==", "religion", reltypes[i]]]);
	}

    // Set the label to the year
    document.getElementById('year').textContent = year;
}

map.on('load', function() {
	//d3.json('data/religion2004.geojson', function(err, data) {
	d3.json('http://www.chinareligionatlas.com.s3-website-us-east-1.amazonaws.com/data/religion2004.geojson', function(err, data) {
        if (err) throw err;

        // Create an integer year value and a string religion value. STARTYEAR is a string, so can't use that for filter
        data.features = data.features.map(function(d) {
            d.properties.year = parseInt(d.properties.STARTYEAR, 10);
            d.properties.religion = numToRel[d.properties.TYPE];
            return d;
        });

		map.addSource('relpoints', {
	        "type": "geojson",
	        "data": data
	    });

		// load layer by religion type
	    data.features.forEach(function(d) {
	        var layerID = numToRel[d.properties.TYPE];

	        // add new unique year to years array - only for finding out min and max STARTYEAR
	        // uniqueYears(d.properties.STARTYEAR, years);

	        // Add a layer for this religion type if it hasn't been added already.
	        if (!map.getLayer(layerID)) {
	        	//reltypes.push(layerID);
	            map.addLayer({
	                "id": layerID,
	                "type": "circle",
	                "source": "relpoints",
	                'layout': {
	                	'visibility': 'none'
	                },
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
			                0.0, '#aaffc3',
			                1.0, '#FF0000',
			                3.0, '#A52A2A',
			                4.0, '#006C35',
			                5.0, '#FFD700',
			                9.0, '#4363d8',
			                '#000075'
			            ],	
			            'circle-stroke-width': 1.3,
			            'circle-stroke-color': "white",
		            },
		        });
	        }
	    });

	    // min year = 210, max year = 2004
        years.sort(function(a, b) { return a - b} );

	    filterBy(year);

	    document.getElementById('slider').addEventListener('input', function(e) {
            year = parseInt(e.target.value, 10);
            filterBy(year);
        });

	});
});

// For allowing a space in between 'religious' and 'management' on the button
var txtContentToReligion = {
	'Religious Management': 'ReligiousManagement',
	'Buddhism': 'Buddhism',
	'Taoism': 'Taoism',
	'Islam': 'Islam',
	'Christianity': 'Christianity',
	'Others' : 'Others'
}


for (i = 0; i < reltypes.length; i++) {
	var id = reltypes[i];

    var link = document.getElementById(id + 'Btn');

    link.addEventListener('click', function (e) {
        var clickedLayer = txtContentToReligion[this.textContent.trim()];
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility == 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            //console.log('hiding layer...');
            //this.className = '';
        } else {
            //this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            link.style.backgroundColor = '';
            //console.log('revealing layer...');
        }
    });
}