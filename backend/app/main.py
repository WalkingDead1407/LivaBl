from fastapi import FastAPI

app = FastAPI(title="Livebl API")

@app.get("/")
def root():
    return {"message": "Livebl API running"}
