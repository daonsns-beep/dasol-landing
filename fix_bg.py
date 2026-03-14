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
        # rembg automatically handles RGBA
        transparent_image = remove(input_image)
        
        print(f"Adding solid white background...")
        # create a white canvas of the same size
        white_bg = Image.new("RGBA", transparent_image.size, "WHITE")
        # paste the transparent image onto the white canvas using its alpha channel as mask
        white_bg.paste(transparent_image, (0, 0), transparent_image)
        
        # save as RGB (which is standard for solid JPEGs/PNGs without transparency)
        final_image = white_bg.convert("RGB")
        final_image.save(out_path)
        print(f"Successfully saved clean image to {out_path}\n")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")
