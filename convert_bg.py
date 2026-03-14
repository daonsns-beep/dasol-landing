import sys
from PIL import Image
import os

def add_bg(filename):
    input_path = f"images/{filename}_t.png"
    output_path = f"images/{filename}.png"
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return
        
    try:
        img = Image.open(input_path).convert('RGBA')
        bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
        bg.paste(img, (0, 0), img)
        bg.convert('RGB').save(output_path)
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error converting {input_path}: {e}")

if __name__ == "__main__":
    add_bg("icon_house")
    add_bg("icon_building")
    add_bg("icon_commercial")
