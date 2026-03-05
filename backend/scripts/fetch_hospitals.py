import os
import osmnx as ox
import geopandas as gpd

# Absolute backend path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

wards_path = os.path.join(BASE_DIR, "data", "processed", "wards_clean.geojson")
output_path = os.path.join(BASE_DIR, "data", "raw", "hospitals.geojson")

print("Loading ward boundaries from:", wards_path)

wards = gpd.read_file(wards_path)

city_boundary = wards.unary_union

print("Fetching hospitals from OSM...")

tags = {"amenity": ["hospital", "clinic"]}

hospitals = ox.features_from_polygon(city_boundary, tags)

print("Total amenities found:", len(hospitals))

hospitals = hospitals[hospitals.geometry.type == "Point"]

print("Point hospitals:", len(hospitals))

hospitals.to_file(output_path, driver="GeoJSON")

print("Hospitals saved to:", output_path)