// Background service worker for Website Generator extension

// Installation handler - consolidated to avoid duplicate listeners
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Website Generator extension:', details.reason);

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

  // Create context menus (for both install and update)
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
  }
  return false;
});

// Handle keyboard shortcuts (if defined in manifest)
// Only set up listener if commands API is available
if (chrome.commands && chrome.commands.onCommand) {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'quick-generate') {
      chrome.action.openPopup();
    }
  });
}
