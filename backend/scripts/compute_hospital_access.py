import os
import geopandas as gpd
import numpy as np

direction = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
wards_path = os.path.join(direction, "data", "processed", "wards_clean.geojson")
hospitals_path = os.path.join(direction, "data", "raw", "hospitals.geojson")
output_path = os.path.join(direction, "data", "processed", "wards_with_hospital_score.geojson")
print("Loading data...")

wards = gpd.read_file(wards_path)
hospitals = gpd.read_file(hospitals_path)
print("Wards:", len(wards))
print("Hospitals:", len(hospitals))

wards = wards.to_crs(epsg=3857)
hospitals = hospitals.to_crs(epsg=3857)
wards["centroid"] = wards.geometry.centroid
print("Computing nearest hospital distances...")

distances = []
for centroid in wards["centroid"]:
    dists = hospitals.distance(centroid)
    min_dist = dists.min()  # meters
    distances.append(min_dist)
wards["nearest_hospital_distance_m"] = distances
wards["nearest_hospital_distance_km"] = wards["nearest_hospital_distance_m"] / 1000 #convert to km

#normalize distance to score (closer = better)
#cap distance at 10 km for normalization
def normalize_distance(dist_km):
    if dist_km is None:
        return None
    dist_km = min(dist_km, 10)
    return 1 - (dist_km / 10)
wards["hospital_score"] = wards["nearest_hospital_distance_km"].apply(normalize_distance)

wards = wards.drop(columns=["centroid"])
wards = wards.to_crs(epsg=4326)
wards.to_file(output_path, driver="GeoJSON")
print("Saved hospital accessibility layer to:", output_path)