from rembg import remove
from PIL import Image
import os

inputs = [
    r"C:\Users\USER\.gemini\antigravity\brain\bc5e06ce-4ec3-4cef-8848-1df4aab9680d\icon_house_1773392340743.png",
    r"C:\Users\USER\.gemini\antigravity\brain\bc5e06ce-4ec3-4cef-8848-1df4aab9680d\icon_building_1773392356275.png",
    r"C:\Users\USER\.gemini\antigravity\brain\bc5e06ce-4ec3-4cef-8848-1df4aab9680d\icon_commercial_1773392370420.png"
]

outputs = [
    "images/icon_house.png",
    "images/icon_building.png",
    "images/icon_commercial.png"
]

for in_path, out_path in zip(inputs, outputs):
    if not os.path.exists(in_path):
        print(f"File not found: {in_path}")
        continue
    
    try:
        input_image = Image.open(in_path)
        print(f"Removing background from {in_path}...")
        # rembg automatically handles RGBA and extracts the subject with true transparency
        transparent_image = remove(input_image)
        
        # Just save the transparent image directly! 
        # PNG supports RGBA (true transparency) natively.
        transparent_image.save(out_path, format="PNG")
        print(f"Successfully saved TRUE TRANSPARENT image to {out_path}\n")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")
