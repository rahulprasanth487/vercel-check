from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from fastapi import FastAPI, Request
import requests
import os
import datetime

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
messages_collection = db["todos"]



@app.post("/api/chat")
async def chat(request: Request):
    payload = await request.json()
    question = payload.get("prompt")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}"
    }
    req_data = {
        "messages": [{"role": "user", "content": question}],
        "model": "openai/gpt-oss-20b",
        "temperature": 1,
        "max_completion_tokens": 800,
        "top_p": 1,
        "stream": False
    }
    groq_res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=req_data
    )
    response = groq_res.json()["choices"][0]["message"]["content"]

    # Save in MongoDB
    messages_collection.insert_one({
        "question": question,
        "response": response,
        "timestamp": datetime.datetime.utcnow()
    })

    # Fetch all messages, newest first
    messages = list(messages_collection.find().sort("timestamp", -1))
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return {"chat_history": messages}  # Return updated history


@app.get("/api/chat")
async def get_chat():
    """Return chat history from MongoDB (newest first)."""
    messages = list(messages_collection.find().sort("timestamp", -1))
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return {"chat_history": messages}
