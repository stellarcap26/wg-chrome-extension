# Installation Guide

This guide will walk you through installing the Website Generator extension in Chrome.

## Quick Install (5 minutes)

### Step 1: Download the Extension

```bash
git clone https://github.com/stellarcap26/wg-chrome-extension.git
cd wg-chrome-extension
```

Or download the ZIP file and extract it.

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar and press Enter
3. Or click the three-dot menu → More Tools → Extensions

### Step 3: Enable Developer Mode

Look for the "Developer mode" toggle in the top-right corner and turn it **ON**.

### Step 4: Load the Extension

1. Click the "Load unpacked" button
2. Navigate to the `wg-chrome-extension` folder
3. Click "Select" or "Open"

### Step 5: Verify Installation

You should see the Website Generator extension appear in your extensions list. The extension icon should also appear in your Chrome toolbar (you may need to click the puzzle piece icon and pin it).

## Troubleshooting

### Extension doesn't appear

- Make sure Developer mode is enabled
- Verify you selected the correct folder (the one containing `manifest.json`)
- Check for error messages on the extensions page

### Extension icon not visible

- Click the puzzle piece icon in Chrome toolbar
- Find "Website Generator for B12"
- Click the pin icon to keep it visible

### "Manifest file is missing or unreadable"

- Make sure you selected the root folder containing `manifest.json`
- Check that all files were properly downloaded/extracted

### Permission errors

The extension requires certain permissions to function:
- Access to active tab (to extract content)
- Storage (to save preferences)
- All URLs (to work on any website)

These are normal for this type of extension.

## Updating the Extension

When updates are available:

1. Download/pull the latest version
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Or click "Remove" and reinstall using the steps above

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Website Generator for B12"
3. Click "Remove"
4. Confirm removal

## Next Steps

After installation:

1. Read the [README.md](README.md) for usage instructions
2. Try the different extraction modes
3. Customize advanced options to your preference
4. Check out the example use cases

## Getting Help

If you encounter issues:

1. Check the [README.md](README.md) troubleshooting section
2. Open Chrome DevTools console for error messages
3. Open an issue on GitHub with:
   - Chrome version
   - Error messages
   - Steps to reproduce

## Custom Icons (Optional)

The extension includes basic placeholder icons. To create custom branded icons:

1. Open `icons/generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download each icon (16px, 48px, 128px)
4. Replace the PNG files in the `icons/` folder
5. Reload the extension in Chrome

See [icons/README.md](icons/README.md) for detailed instructions.

## Developer Setup

For developers who want to modify the extension:

### Prerequisites

- Google Chrome or Chromium browser
- Text editor or IDE
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extensions API

### Development Workflow

1. Install the extension as described above
2. Make changes to the code
3. Go to `chrome://extensions/`
4. Click the refresh icon on the extension
5. Test your changes
6. Repeat

### Debugging

**Popup:**
- Right-click extension icon → "Inspect popup"
- Opens DevTools for the popup

**Background Script:**
- Go to `chrome://extensions/`
- Click "Inspect views: service worker"

**Content Script:**
- Open DevTools on any webpage (F12)
- Check Console tab for messages from content.js

### File Structure

```
wg-chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── styles.css            # Popup styling
├── content.js            # Content extraction
├── background.js         # Background service worker
└── icons/                # Extension icons
```

## Publishing to Chrome Web Store (Advanced)

To publish this extension to the Chrome Web Store:

1. Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole)
2. Prepare required assets:
   - High-quality icons (16x16, 48x48, 128x128)
   - Screenshots (1280x800 or 640x400)
   - Promotional images (optional)
   - Detailed description
3. Zip the extension folder (exclude .git and other non-essential files)
4. Upload to Chrome Web Store Developer Dashboard
5. Fill in all required information
6. Submit for review

Note: Publishing requires a one-time $5 developer registration fee.

---

Need help? Check the [README.md](README.md) or open an issue on GitHub.
