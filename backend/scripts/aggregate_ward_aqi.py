import os
import geopandas as gpd

direction = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
wards_path = os.path.join(direction, "data", "processed", "wards_clean.geojson")
aqi_path = os.path.join(direction, "data", "processed", "aqi_stations.geojson")
output_path = os.path.join(direction, "data", "processed", "wards_with_aqi.geojson")
print("Loading data...")

wards = gpd.read_file(wards_path)
aqi = gpd.read_file(aqi_path)
print("Wards:", len(wards))
print("AQI stations:", len(aqi))

if wards.crs != aqi.crs:
    aqi = aqi.to_crs(wards.crs)
print("Performing spatial join...")
joined = gpd.sjoin(aqi, wards, how="inner", predicate="within")
print("Stations matched to wards:", len(joined))
#Group by ward 
ward_name_col = "Ward_Name"
aggregated = (
    joined.groupby(ward_name_col)
    .agg(
        mean_aqi=("aqi", "mean"),
        station_count=("aqi", "count")
    )
    .reset_index()
)
print("Wards with AQI:", len(aggregated))
wards_with_aqi = wards.merge(aggregated, on=ward_name_col, how="left")
#Normalize AQI to score (0–1)
def normalize_aqi(aqi):
    if aqi is None:
        return None
    if aqi != aqi:  #handles nan
        return None
    aqi = min(aqi, 300)
    return 1 - (aqi / 300)
wards_with_aqi["pollution_score"] = wards_with_aqi["mean_aqi"].apply(normalize_aqi)
wards_with_aqi.to_file(output_path, driver="GeoJSON")
print("Saved ward-level AQI to:", output_path)