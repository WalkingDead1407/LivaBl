from dotenv import load_dotenv
import os
import requests
import json
import geopandas as gpd
from shapely.geometry import Point

load_dotenv()
TOKEN = os.getenv("WAQI_API_TOKEN")

direction = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw_output = os.path.join(direction, "data", "raw", "aqi_stations_raw.json")
processed_output = os.path.join(direction, "data", "processed", "aqi_stations.geojson")

search_url = f"https://api.waqi.info/search/?keyword=delhi&token={TOKEN}"

print("Fetching Delhi AQI stations from WAQI...")

resp = requests.get(search_url)

if resp.status_code != 200:
    print("HTTP Error:", resp.status_code)
    exit()

data = resp.json()

if data["status"] != "ok":
    print("API error:", data)
    exit()

stations = data["data"]

with open(raw_output, "w") as f:
    json.dump(stations, f)

print("Total stations fetched:", len(stations))

cleaned_data = []
for s in stations:
    if s["aqi"] == "-" or s["aqi"] is None:
        continue  
    lat, lon = s["station"]["geo"]
    cleaned_data.append({
        "station": s["station"]["name"],
        "aqi": int(s["aqi"]),
        "timestamp": s["time"]["stime"],
        "latitude": lat,
        "longitude": lon,
        "geometry": Point(lon, lat)
    })

print("Valid AQI stations:", len(cleaned_data))

# Converting to GeoDataFrame
gdf = gpd.GeoDataFrame(cleaned_data, crs="EPSG:4326")

gdf.to_file(processed_output, driver="GeoJSON")
print("Saved processed AQI to:", processed_output)