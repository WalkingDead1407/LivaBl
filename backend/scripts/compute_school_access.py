import geopandas as gpd
import numpy as np
from shapely.geometry import Point
from scipy.spatial import cKDTree
import os

direction = os.path.dirname(os.path.dirname(__file__))
wards_path = os.path.join(direction, "data/processed/wards_with_hospital_score.geojson")
schools_path = os.path.join(direction, "data/raw/schools.geojson")
wards = gpd.read_file(wards_path)
schools = gpd.read_file(schools_path)
print("Wards:", len(wards))
print("Schools:", len(schools))

wards = wards.to_crs(epsg=3857)
schools = schools.to_crs(epsg=3857)
ward_centroids = wards.geometry.centroid
ward_coords = np.array([(p.x, p.y) for p in ward_centroids])
school_coords = np.array([(p.x, p.y) for p in schools.geometry])
print("Computing nearest school distances...")
tree = cKDTree(school_coords)
distances, _ = tree.query(ward_coords, k=1)
wards["nearest_school_distance"] = distances

max_dist = wards["nearest_school_distance"].max()
wards["school_score"] = 1 - (wards["nearest_school_distance"] / max_dist)
output_path = os.path.join(direction, "data/processed/wards_with_school_score.geojson")
wards.to_file(output_path, driver="GeoJSON")
print("Saved school accessibility layer to:", output_path)