# Extension Icons

This directory contains the icons for the Website Generator Chrome extension.

## Required Icon Sizes

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## How to Generate Icons

### Option 1: Use the HTML Icon Generator (Easiest)

1. Open `generate-icons.html` in your web browser
2. The icons will be automatically generated
3. Click the download buttons to save each icon size
4. Place the downloaded files in this directory

### Option 2: Use Python Script

If you have Python with Pillow installed:

```bash
pip install Pillow
python3 generate_icons.py
```

### Option 3: Create Your Own Icons

You can create your own custom icons using any image editor:

1. Create three PNG files with the sizes listed above
2. Use the extension's color scheme: gradient from #667eea to #764ba2
3. Include a recognizable symbol (like a browser window or "WG" text)
4. Save them as `icon16.png`, `icon48.png`, and `icon128.png` in this directory

### Option 4: Use Online Tools

You can use online favicon generators like:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

## Design Guidelines

- **Colors**: Use a gradient from purple (#667eea) to violet (#764ba2)
- **Symbol**: A simplified browser/website icon or "WG" initials
- **Style**: Modern, clean, and recognizable at small sizes
- **Background**: Should work well on both light and dark browser themes

## Temporary Placeholder

For development purposes, you can use simple colored squares until you create proper icons:

```bash
# This will create basic placeholder icons (requires ImageMagick)
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

Note: Chrome extensions will still load without icons, but will show a default placeholder.
