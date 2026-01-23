// Background service worker for Website Generator extension

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Website Generator extension installed');

    // Set default options
    chrome.storage.sync.set({
      includeStyles: true,
      includeImages: true,
      includeLayout: true,
      enhancePrompt: true
    });
  } else if (details.reason === 'update') {
    console.log('Website Generator extension updated');
  }
});

// Context menu creation (right-click menu)
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for entire site
  chrome.contextMenus.create({
    id: 'generateFromSite',
    title: 'Clone this site with B12 (up to 5 pages)',
    contexts: ['page']
  });

  // Create context menu for images
  chrome.contextMenus.create({
    id: 'generateFromImage',
    title: 'Generate B12 website from this image',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generateFromSite') {
    handleSiteGeneration(tab);
  } else if (info.menuItemId === 'generateFromImage') {
    handleImageGeneration(info, tab);
  }
});

/**
 * Handle generation from entire site (multi-page)
 */
async function handleSiteGeneration(tab) {
  // Simply open the popup - the user can click "Entire Site" there
  chrome.action.openPopup();
}

/**
 * Handle generation from image
 */
function handleImageGeneration(info, tab) {
  const prompt = `Create a professional website featuring this image:\n\n` +
    `Image Source: ${info.srcUrl}\n\n` +
    'REQUIREMENTS:\n\n' +
    'Design:\n' +
    '- Use this image as the hero/banner image prominently\n' +
    '- Create a modern, visually appealing layout that complements the image\n' +
    '- Design should feel professional and polished\n' +
    '- Ensure the image is displayed at optimal quality and size\n\n' +
    'Layout:\n' +
    '- Hero section with the image as the focal point\n' +
    '- Supporting content sections below\n' +
    '- Clear call-to-action elements\n' +
    '- Responsive design for all devices\n\n' +
    'Style:\n' +
    '- Modern, clean aesthetic\n' +
    '- Color scheme that complements the image\n' +
    '- Appropriate typography and spacing\n' +
    '- Smooth transitions and subtle animations\n\n' +
    'Content:\n' +
    '- Engaging placeholder content\n' +
    '- Proper content hierarchy\n' +
    '- SEO-friendly structure\n';

  const b12Url = createB12Url(prompt);
  chrome.tabs.create({ url: b12Url });
}

/**
 * Create B12 URL with encoded prompt
 */
function createB12Url(prompt) {
  const baseUrl = 'https://b12.io/signup/';
  const encodedPrompt = encodeURIComponent(prompt);
  return `${baseUrl}?business_description=${encodedPrompt}`;
}

// Message handler for communication between components
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateB12Url') {
    const url = createB12Url(request.prompt);
    sendResponse({ url });
    return false;
  } else if (request.action === 'captureScreenshot') {
    // Handle screenshot capture asynchronously
    handleScreenshotCapture(request.rect, sender.tab)
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error('Screenshot capture failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
  return false;
});

/**
 * Handle screenshot capture
 */
async function handleScreenshotCapture(rect, tab) {
  try {
    // Check if the URL is restricted
    if (!tab || !tab.url) {
      throw new Error('Cannot access tab information');
    }

    const restrictedProtocols = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:'];
    const isRestricted = restrictedProtocols.some(protocol => tab.url.startsWith(protocol));

    if (isRestricted) {
      throw new Error('Cannot capture screenshots on browser internal pages. Please navigate to a regular website.');
    }

    // Capture the visible tab
    const screenshot = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

    if (!screenshot) {
      throw new Error('Failed to capture screenshot');
    }

    // Store the screenshot and area info
    await chrome.storage.local.set({
      screenshot: screenshot,
      screenshotRect: rect,
      timestamp: Date.now()
    });

    // Show success notification to user
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Screenshot Captured!',
      message: 'Click the extension icon to generate a website from your screenshot.',
      priority: 2
    });

    // Set a badge to indicate screenshot is ready
    await chrome.action.setBadgeText({ text: '1' });
    await chrome.action.setBadgeBackgroundColor({ color: '#5048C7' });

  } catch (error) {
    console.error('Screenshot capture error:', error);
    // Show error notification to user
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Screenshot Capture Failed',
      message: error.message || 'Failed to capture screenshot. Please try again on a regular website.',
      priority: 2
    });
    throw error;
  }
}

// Handle keyboard shortcuts (if defined in manifest)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'quick-generate') {
    chrome.action.openPopup();
  }
});
