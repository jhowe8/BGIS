# BGIS
Mapbox map displaying religious data of China. Loads pretty slowly, but it is making use of 80,000+ points of data. I wanted to test the limits of mapbox. Removing unnecessary properties of each point helps A LOT.

Available online at http://www.chinareligionatlas.com.s3-website-us-east-1.amazonaws.com/

Only seems to work if you allow 10 to 15 seconds for AWS to load up all the data points from the geojson file.
Data file (religion2004.geojson) can only be found on aws site.
