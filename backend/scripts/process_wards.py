import geopandas as gpd 
from pathlib import Path as pt

raw_path=pt("data/raw/delhi_wards.geojson")
output= pt("data/processed/wards_clean.geojson")

def main():
    print("Loading raw wards data>>>")
    gdf = gpd.read_file(raw_path)

    print(" Cleaning columns?>>>")
    keep_columns= [col for col in gdf.columns if col.lower() in ["ward", "ward_name", "name"]]
    
    if keep_columns:
        gdf = gdf[keep_columns + ["geometry"]]
    else:
        gdf = gdf[["geometry"]]

    print("Generating ward IDs>>>")
    gdf["ward_id"] = range(1, len(gdf) + 1)

    print("Validating geometries>>>")
    gdf = gdf[gdf.is_valid]

    print("Saving cleaned GeoJSON>>>")
    output.parent.mkdir(parents=True, exist_ok=True)
    gdf.to_file(output, driver="GeoJSON")

    print("Clean file saved at:", output)

if __name__ == "__main__":
    main()