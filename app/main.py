from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import List
from moviepy.editor import VideoFileClip
import os

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "video/mp4"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images and videos are allowed.")

    # Save file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Check video duration if video
    if file.content_type == "video/mp4":
        clip = VideoFileClip(str(file_path))
        if clip.duration > 60:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Video duration exceeds 1 minute.")
        clip.close()

    return {"filename": file.filename, "url": f"/uploads/{file.filename}"}

# Delete endpoint
@app.delete("/delete/{filename}")
async def delete_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    os.remove(file_path)
    return {"detail": "File deleted successfully"}