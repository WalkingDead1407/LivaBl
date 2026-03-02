import geopandas as gpd
from sqlalchemy import create_engine, text
import json

url = "mysql+pymysql://root:password@localhost/livabl"

engine = create_engine(
    "mysql+pymysql://livebl_user:password123@localhost/livabl"
)


engine = create_engine(url)

gdf = gpd.read_file("../data/processed/wards_clean.geojson")

name_col = None
for c in gdf.columns:
    if "name" in c.lower():
        name_col = c
        break

with engine.begin() as conn:
    for row in gdf.iterrows():
        ward_id = int(row["ward_id"])
        ward_name = row[name_col] if name_col else f"Ward {ward_id}"
        boundary = json.loads(row.geometry.to_json())

        conn.execute(
            text("""
                INSERT INTO wards (ward_id, ward_name, boundary)
                VALUES (:id, :name, :boundary)
            """),
            {"id": ward_id, "name": ward_name, "boundary": json.dumps(boundary)}
        )

print("Wards inserted successfully")