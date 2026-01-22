# Website Generator for B12 - Chrome Extension

Transform any web content into beautiful websites using B12's AI-powered website builder.

## Overview

Website Generator is a powerful Chrome extension that lets you extract content from any webpage and instantly generate a professional website using [B12](https://b12.io), the AI website builder. Whether you're cloning an existing site, converting a mockup, or building from selected content, this extension makes it effortless.

## Features

### 🎯 Multiple Extraction Modes

- **Selected Content**: Highlight any text, images, or tables and convert them into a website
- **Entire Page**: Clone complete websites with structure, styling, and content
- **Visible Content**: Extract only what's currently visible on screen
- **Image Upload**: Turn mockups and screenshots into functional websites

### 🔥 Intelligent Content Extraction

- Automatically detects and extracts:
  - Text content and headings
  - Images with metadata
  - Tables and structured data
  - Forms and input fields
  - Links and navigation
  - Color schemes and fonts
  - Layout structure

### ⚙️ Advanced Options

- Include/exclude styling information
- Control image extraction
- Preserve layout structure
- AI-enhanced prompt generation
- Edit prompts before generating

### 🚀 Quick Actions

- Right-click context menu integration
- One-click generation
- Copy prompts to clipboard
- Direct B12 integration

## Installation

### From Source

1. Clone or download this repository:
   ```bash
   git clone https://github.com/stellarcap26/wg-chrome-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top-right corner)

4. Click "Load unpacked"

5. Select the `wg-chrome-extension` directory

6. The extension icon should appear in your Chrome toolbar

### Optional: Generate Custom Icons

The extension includes placeholder icons. To create custom branded icons:

1. Open `icons/generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download each icon size
4. Replace the placeholder icons in the `icons/` directory

See [icons/README.md](icons/README.md) for detailed instructions.

## Usage

### Method 1: Extension Popup

1. Click the extension icon in your Chrome toolbar
2. Choose your extraction method:
   - **Selected Content**: First highlight content on the page, then click this option
   - **Entire Page**: Extract the full page structure and content
   - **Visible Content**: Extract only what's currently visible
   - **Upload Mockup**: Choose an image file to convert
3. Review the generated prompt
4. Click "Generate Website with B12"

### Method 2: Right-Click Context Menu

- **On selected text**: Right-click → "Generate B12 website from selection"
- **On an image**: Right-click → "Generate B12 website from image"
- **On any page**: Right-click → "Clone this page with B12"

### Advanced Options

Click the "Advanced Options" dropdown in the popup to customize:

- **Include styling information**: Extract color schemes and fonts
- **Include images**: Add images to the prompt
- **Describe layout structure**: Include layout and structural information
- **AI-enhance prompt**: Apply advanced prompt engineering

### Edit Prompts

Before generating:

1. Review the prompt preview
2. Click "Edit Prompt"
3. Modify the prompt as needed
4. Click "Save & Generate"

## Use Cases

### 1. Clone a Facebook Page

Visit any Facebook page → Click extension → "Entire Page" → Generate with B12

### 2. Turn a Spreadsheet into a Website

1. Open a Google Sheets or Excel Online spreadsheet
2. Highlight the table data
3. Click extension → "Selected Content"
4. Generate website with structured data

### 3. Convert Design Mockups

1. Click extension → "Upload Mockup/Screenshot"
2. Select your design file
3. B12 will recreate the design as a functional website

### 4. Build from Blog Posts

1. Navigate to a blog post or article
2. Highlight the content you want
3. Click extension → "Selected Content"
4. Generate a website with that content

## How It Works

1. **Content Extraction**: The extension's content script analyzes the current webpage and extracts relevant content based on your selection

2. **Prompt Generation**: Extracted content is transformed into a detailed, natural language prompt optimized for B12

3. **B12 Integration**: The prompt is URL-encoded and passed to B12's website builder via the signup URL

4. **Website Creation**: B12's AI analyzes the prompt and generates a professional website

## Technical Details

### File Structure

```
wg-chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and prompt generation
├── styles.css            # Popup styling
├── content.js            # Content extraction script
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── generate-icons.html
└── README.md
```

### Permissions

- `activeTab`: Access current tab content
- `scripting`: Inject content extraction script
- `storage`: Save user preferences
- `tabs`: Create new tabs for B12
- `<all_urls>`: Extract content from any website

### Browser Compatibility

- Chrome/Chromium (Manifest V3)
- Microsoft Edge
- Brave
- Any Chromium-based browser

## Development

### Prerequisites

- Chrome/Chromium browser
- Basic knowledge of JavaScript and Chrome Extensions API

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Debugging

- **Popup**: Right-click the extension icon → "Inspect popup"
- **Background script**: Go to `chrome://extensions/` → Click "Inspect views: background page"
- **Content script**: Open DevTools on any webpage → Check Console for errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this extension for any purpose.

## Support

For issues or questions:
- Open an issue on GitHub
- Visit [B12.io](https://b12.io) for B12-related questions

## Privacy

This extension:
- Only accesses webpage content when you explicitly trigger an extraction
- Does not collect or store any personal data
- Does not track your browsing history
- Only sends data to B12 when you choose to generate a website

## Roadmap

- [ ] Support for more content types (videos, audio)
- [ ] Batch processing multiple pages
- [ ] Save and manage prompt templates
- [ ] Export prompts to various formats
- [ ] Integration with other AI website builders
- [ ] Chrome Web Store publication

## About B12

[B12](https://b12.io) is an AI-powered website builder that creates professional websites in minutes. This extension is an unofficial tool to enhance the B12 experience.

---

Made with ❤️ for the web development community
