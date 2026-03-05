import os
import osmnx as ox
import geopandas as gpd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

wards_path = os.path.join(BASE_DIR, "data", "processed", "wards_clean.geojson")
output_path = os.path.join(BASE_DIR, "data", "raw", "schools.geojson")

print("Loading ward boundaries...")
wards = gpd.read_file(wards_path)

city_boundary = wards.union_all()

print("Fetching schools from OSM...")

tags = {
    "amenity": ["school", "college", "university"]
}

schools = ox.features_from_polygon(city_boundary, tags)

print("Total features found:", len(schools))

# Keep only point geometries
schools = schools[schools.geometry.type == "Point"]

print("Point schools:", len(schools))

schools.to_file(output_path, driver="GeoJSON")

print("Saved to:", output_path)