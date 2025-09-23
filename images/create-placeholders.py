#!/usr/bin/env python3
"""
Character Image Placeholder Generator
Creates more detailed placeholder images for characters
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_character_image(name, bg_color, icon, text_color="white"):
    """Create a 200x200 character placeholder image"""
    # Create image
    img = Image.new('RGB', (200, 200), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a font, fallback to default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
        small_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 12)
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Draw icon (emoji or symbol)
    try:
        # This is a simplified approach - in practice you'd want better emoji rendering
        draw.text((100, 80), icon, fill=text_color, font=font, anchor="mm")
    except:
        # Fallback to simple shapes
        if icon == "⚔️":
            draw.rectangle([80, 70, 120, 110], outline=text_color, width=3)
        elif icon == "🐕":
            draw.ellipse([80, 70, 120, 110], outline=text_color, width=3)
        elif icon == "🌿":
            draw.rectangle([90, 80, 110, 100], outline=text_color, width=3)
        elif icon == "👑":
            draw.rectangle([85, 75, 115, 105], outline=text_color, width=3)
        elif icon == "🗡️":
            draw.rectangle([85, 75, 115, 105], outline=text_color, width=3)
        elif icon == "🏛️":
            draw.rectangle([80, 70, 120, 110], outline=text_color, width=3)
    
    # Draw character name
    draw.text((100, 150), name, fill=text_color, font=small_font, anchor="mm")
    
    return img

def main():
    """Generate all character placeholder images"""
    characters = [
        ("The Warden", "#2c3e50", "⚔️"),
        ("Merlin", "#8b4513", "🐕"),
        ("Elira", "#228b22", "🌿"),
        ("The Caller", "#4b0082", "👑"),
        ("Tov", "#8b4513", "🗡️"),
        ("First Weavers", "#2c3e50", "🏛️")
    ]
    
    for name, color, icon in characters:
        # Create filename
        filename = f"character-{name.lower().replace(' ', '-').replace('the-', '')}.png"
        filename = filename.replace("first-weavers", "first-weavers")
        
        # Generate image
        img = create_character_image(name, color, icon)
        
        # Save image
        img.save(filename)
        print(f"Created {filename}")
    
    print("\nAll character placeholder images created!")
    print("For photorealistic images, use the prompts in character-prompts.txt")

if __name__ == "__main__":
    main()
