#!/usr/bin/env python3
"""
Generate icons for the Website Generator Chrome extension
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient(width, height, color1, color2):
    """Create a gradient image"""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (x + y) / (width + height)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_icon(size):
    """Draw the extension icon - website generation theme"""
    # Create gradient background (B12 purple)
    img = create_gradient(size, size, (80, 72, 199), (88, 53, 197))
    draw = ImageDraw.Draw(img)

    # Calculate dimensions
    padding = size * 0.15

    # Draw browser window
    window_width = size * 0.6
    window_height = size * 0.5
    window_left = padding
    window_top = padding

    # Window outline with rounded corners
    outline_width = max(2, int(size * 0.06))
    corner_radius = int(size * 0.08)

    # Draw rounded rectangle for window
    draw.rounded_rectangle(
        [window_left, window_top, window_left + window_width, window_top + window_height],
        radius=corner_radius,
        fill=(255, 255, 255, 255),
        outline=None
    )

    # Draw browser chrome/header
    bar_height = window_height * 0.25
    draw.rounded_rectangle(
        [window_left, window_top, window_left + window_width, window_top + bar_height],
        radius=corner_radius,
        fill=(230, 230, 240)
    )

    # Draw content lines inside window
    line_height = max(1, int(size * 0.04))
    line_spacing = window_height * 0.18
    line_left = window_left + window_width * 0.12
    line_width = window_width * 0.76

    for i in range(3):
        line_top = window_top + bar_height + window_height * 0.15 + i * line_spacing
        draw.rectangle(
            [line_left, line_top, line_left + line_width, line_top + line_height],
            fill=(200, 200, 220)
        )

    # Draw magic wand/sparkle effect
    wand_x = size * 0.7
    wand_y = size * 0.65
    wand_length = size * 0.25
    wand_width = max(2, int(size * 0.05))

    # Wand stick
    draw.line(
        [(wand_x, wand_y), (wand_x + wand_length * 0.7, wand_y + wand_length * 0.7)],
        fill=(255, 215, 0),
        width=wand_width
    )

    # Star/sparkle at wand tip
    star_size = size * 0.12
    star_x = wand_x - star_size * 0.3
    star_y = wand_y - star_size * 0.3

    # Draw star (simple cross pattern)
    draw.line(
        [(star_x, star_y), (star_x + star_size, star_y + star_size)],
        fill=(255, 215, 0),
        width=max(2, int(size * 0.06))
    )
    draw.line(
        [(star_x + star_size, star_y), (star_x, star_y + star_size)],
        fill=(255, 215, 0),
        width=max(2, int(size * 0.06))
    )

    # Add small sparkles
    sparkle_size = size * 0.06
    sparkles = [
        (size * 0.75, size * 0.35),
        (size * 0.88, size * 0.5),
        (size * 0.65, size * 0.8)
    ]

    for sx, sy in sparkles:
        draw.ellipse(
            [sx - sparkle_size/2, sy - sparkle_size/2,
             sx + sparkle_size/2, sy + sparkle_size/2],
            fill=(255, 215, 0)
        )

    return img

def main():
    """Generate all icon sizes"""
    sizes = [16, 48, 128]
    script_dir = os.path.dirname(os.path.abspath(__file__))

    print("Generating icons...")

    for size in sizes:
        icon = draw_icon(size)
        output_path = os.path.join(script_dir, f'icon{size}.png')
        icon.save(output_path, 'PNG')
        print(f"Generated: icon{size}.png")

    print("\nAll icons generated successfully!")

if __name__ == '__main__':
    main()
