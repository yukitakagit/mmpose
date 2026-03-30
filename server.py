import os
import shutil
import json
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from mmpose.apis.inferencers import MMPoseInferencer

def convert_np(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, dict):
        return {k: convert_np(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_np(v) for v in obj]
    return obj



app = FastAPI()

# Allow cross-origin requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the RTMPose inferencer for fast inference
print("Initializing MMPose...")
# "rtmpose" is a highly optimized model suitable for demo and fast inference
inferencer = MMPoseInferencer(pose2d='rtmo', show_progress=False)

# Make sure output directories exist
os.makedirs("public/predictions/vis", exist_ok=True)
os.makedirs("public/predictions/json", exist_ok=True)
os.makedirs("public/predictions/uploads", exist_ok=True)

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    # Save uploaded file
    file_path = f"public/predictions/uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Run inference
    print(f"Running inference on {file_path}...")
    
    # generate predictions
    result_generator = inferencer(
        file_path,
        vis_out_dir="public/predictions/vis",
        pred_out_dir="public/predictions/json"
    )
    
    # process the generator (this executes the inference)
    predictions = []
    for res in result_generator:
        # Avoid storing large Numpy arrays in the JSON response by converting them or filtering.
        # res typically contains 'visualization' (if return_vis=True), and 'predictions'.
        pred_dict = res['predictions'][0]
        predictions.append(convert_np(pred_dict))
    
    # Generate URLs for the frontend
    # MMPose inferencer saves the visualized image using the same filename
    vis_url = f"/api/vis/{file.filename}"
    
    # Construct paths
    return JSONResponse(content={
        "status": "success",
        "filename": file.filename,
        "vis_url": vis_url,
        "predictions": predictions
    })

# Mount the static directory to serve visualization images natively 
app.mount("/api/vis", StaticFiles(directory="public/predictions/vis"), name="vis")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
