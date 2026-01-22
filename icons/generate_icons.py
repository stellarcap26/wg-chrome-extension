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
    """Draw the extension icon"""
    # Create gradient background
    img = create_gradient(size, size, (102, 126, 234), (118, 75, 162))
    draw = ImageDraw.Draw(img)

    # Calculate dimensions
    padding = size * 0.2
    icon_size = size * 0.6
    left = padding
    top = padding

    # Draw document outline
    outline_width = max(1, int(size * 0.08))
    draw.rectangle(
        [left, top, left + icon_size, top + icon_size],
        outline='white',
        width=outline_width
    )

    # Draw top bar (browser chrome)
    bar_height = icon_size * 0.2
    draw.rectangle(
        [left, top, left + icon_size, top + bar_height],
        fill=(255, 255, 255, 230)
    )

    # Draw content lines
    line_height = max(1, int(size * 0.05))
    line_spacing = icon_size * 0.15
    line_left = left + icon_size * 0.15
    line_width = icon_size * 0.7

    for i in range(3):
        line_top = top + icon_size * 0.3 + i * line_spacing
        draw.rectangle(
            [line_left, line_top, line_left + line_width, line_top + line_height],
            fill=(255, 255, 255, 180)
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
