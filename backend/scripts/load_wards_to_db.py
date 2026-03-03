import geopandas as gpd
import json
from shapely.geometry import mapping
from app.db import get_connection
import math 

gdf = gpd.read_file("../data/processed/wards_clean.geojson")
print("Rows in GeoJSON:", len(gdf))

name_col = None
for c in gdf.columns:
    if "name" in c.lower():
        name_col = c
        break

conn = get_connection()
cursor = conn.cursor()

try:
    for _, row in gdf.iterrows():
        ward_id = int(row["ward_id"])
        ward_name = row[name_col] if name_col else f"Ward {ward_id}"
        if ward_name is None or (isinstance(ward_name, float) and math.isnan(ward_name)):           #For nan issue
            ward_name = f"Ward {ward_id}"
        boundary = json.dumps(mapping(row.geometry))

        cursor.execute(
        """
            INSERT INTO wards (ward_id, ward_name, boundary)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                ward_name = VALUES(ward_name),
                boundary = VALUES(boundary)
        """,
    (ward_id, ward_name, boundary),
)

    conn.commit()
    print("Wards inserted/updated successfully")

except Exception as e:
    conn.rollback()
    print("Error inserting wards:", e)

finally:
    conn.close()