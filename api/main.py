from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["verceldemo_db"]
todos_collection = db["todos"]

@app.get("/api/health")
def health_check():
    todos = list(todos_collection.find({}, {"_id": 1, "title": 1, "done": 1}))
    for todo in todos:
        todo["_id"] = str(todo["_id"])
    return {"status": "healthy", "todos": todos}
