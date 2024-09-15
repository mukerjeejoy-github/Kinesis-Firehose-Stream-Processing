from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import boto3
import os
import json
from dotenv import load_dotenv, dotenv_values
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from datetime import datetime

# Function to clear the environment variables loaded from .env
def clear_env_vars():
    env_vars = dotenv_values()
    for key in env_vars.keys():
        if key in os.environ:
            del os.environ[key]

# Clear previously loaded environment variables
clear_env_vars()

# Load environment variables from .env file
load_dotenv()
print("Loaded .env file")

app = FastAPI()  

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Environment variable to choose between Kinesis and Firehose
IS_FIREHOSE = os.getenv("IS_FIREHOSE")
# Read environment variables
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
FIREHOSE_STREAM_NAME = os.getenv("FIREHOSE_STREAM_NAME")
KINESIS_STREAM_NAME = os.getenv("KINESIS_STREAM_NAME")

# Set up clients
if (IS_FIREHOSE == "enabled"):
    client = boto3.client(
        'firehose',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    STREAM_NAME = FIREHOSE_STREAM_NAME
else:
    client = boto3.client(
        'kinesis',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    STREAM_NAME = KINESIS_STREAM_NAME
    
templates = Jinja2Templates(directory="templates")

class Member(BaseModel):
    id: int
    name: str
    age: int
    email: str
    phone: str
    address: str
    timestamp: str

@app.post("/members/")
async def add_member(member: Member):
    try:
        record_data = json.dumps({
            'eventType': 'add_member',
            'details': member.dict(),
            'timestamp': member.timestamp
        }) + '\n'

        if (IS_FIREHOSE == "enabled"):
            response = client.put_record(
                DeliveryStreamName=STREAM_NAME,
                Record={'Data': record_data}
            )
        else:
            response = client.put_record(
                StreamName=STREAM_NAME,
                Data=record_data,
                PartitionKey=str(member.id)
            )

        return {"message": "Member added successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/members/{member_id}")
async def update_member(member_id: int, member: Member):
    try:
        record_data = json.dumps({
            'eventType': 'update_member',
            'details': member.dict(),
            'timestamp': member.timestamp
        }) + '\n'

        if (IS_FIREHOSE == "enabled"):
            response = client.put_record(
                DeliveryStreamName=STREAM_NAME,
                Record={'Data': record_data}
            )
        else:
            response = client.put_record(
                StreamName=STREAM_NAME,
                Data=record_data,
                PartitionKey=str(member.id)
            )

        return {"message": "Member updated successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/members/{member_id}")
async def delete_member(member_id: int):
    try:
        # Generate current timestamp
        current_timestamp = datetime.utcnow().isoformat()
        
        record_data = json.dumps({
            'eventType': 'delete_member',
            'details': {'id': member_id},
            'timestamp': json.dumps({'timestamp': current_timestamp})
        }) + '\n'

        if (IS_FIREHOSE == "enabled"):
            response = client.put_record(
                DeliveryStreamName=STREAM_NAME,
                Record={'Data': record_data}
            )
        else:
            response = client.put_record(
                StreamName=STREAM_NAME,
                Data=record_data,
                PartitionKey=str(member_id)
            )

        return {"message": "Member deleted successfully", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request,
        "IS_FIREHOSE": IS_FIREHOSE,
        "AWS_REGION": AWS_REGION,
        "AWS_ACCESS_KEY_ID": AWS_ACCESS_KEY_ID,
        "AWS_SECRET_ACCESS_KEY": AWS_SECRET_ACCESS_KEY,
        "FIREHOSE_STREAM_NAME": FIREHOSE_STREAM_NAME,
        "KINESIS_STREAM_NAME": KINESIS_STREAM_NAME
    })


print(IS_FIREHOSE)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
