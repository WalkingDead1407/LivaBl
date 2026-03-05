import geopandas as gpd
import pandas as pd

wards = gpd.read_file("data/processed/wards_clean.geojson")
aqi = gpd.read_file("data/processed/wards_with_aqi.geojson")
hospital = gpd.read_file("data/processed/wards_with_hospital_score.geojson")
school = gpd.read_file("data/processed/wards_with_school_score.geojson")
print("Wards:", len(wards))

df = wards.merge(
    aqi[["ward_id", "pollution_score"]],
    on="ward_id",
    how="left"
)
df = df.merge(
    hospital[["ward_id", "hospital_score"]],
    on="ward_id",
    how="left"
)
df = df.merge(
    school[["ward_id", "school_score"]],
    on="ward_id",
    how="left"
)
print("Datasets merged")

#fill missing values
df["pollution_score"] = df["pollution_score"].fillna(df["pollution_score"].mean())
df["hospital_score"] = df["hospital_score"].fillna(df["hospital_score"].mean())
df["school_score"] = df["school_score"].fillna(df["school_score"].mean())
print("Missing values handled")

#livability scoring metrics
W_POLLUTION = 0.4
W_HOSPITAL = 0.3
W_SCHOOL = 0.3

df["livability_score"] = (
    df["pollution_score"] * W_POLLUTION +
    df["hospital_score"] * W_HOSPITAL +
    df["school_score"] * W_SCHOOL
)
print("Livability scores computed")
output_path = "data/processed/wards_score.geojson"
df.to_file(output_path, driver="GeoJSON")
print("Saved final dataset to:", output_path)