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

    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    console.log('Website Generator extension updated');
  }
});

// Context menu creation (right-click menu)
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'generateFromSelection',
    title: 'Generate B12 website from selection',
    contexts: ['selection']
  });

  // Create context menu for images
  chrome.contextMenus.create({
    id: 'generateFromImage',
    title: 'Generate B12 website from image',
    contexts: ['image']
  });

  // Create context menu for pages
  chrome.contextMenus.create({
    id: 'generateFromPage',
    title: 'Clone this page with B12',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generateFromSelection') {
    handleSelectionGeneration(info, tab);
  } else if (info.menuItemId === 'generateFromImage') {
    handleImageGeneration(info, tab);
  } else if (info.menuItemId === 'generateFromPage') {
    handlePageGeneration(tab);
  }
});

/**
 * Handle generation from selected text
 */
async function handleSelectionGeneration(info, tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractSelected' });

    if (response && response.success && response.data) {
      const prompt = generateQuickPrompt(response.data, 'selection');
      const b12Url = createB12Url(prompt);
      chrome.tabs.create({ url: b12Url });
    }
  } catch (error) {
    console.error('Error generating from selection:', error);
    // Open popup as fallback
    chrome.action.openPopup();
  }
}

/**
 * Handle generation from image
 */
function handleImageGeneration(info, tab) {
  const prompt = `Create a website featuring the image from: ${info.srcUrl}\n\n` +
    'Requirements:\n' +
    '- Use this image prominently in the design\n' +
    '- Create a modern, professional layout around it\n' +
    '- Ensure mobile responsiveness\n' +
    '- Add appropriate content sections\n';

  const b12Url = createB12Url(prompt);
  chrome.tabs.create({ url: b12Url });
}

/**
 * Handle generation from entire page
 */
async function handlePageGeneration(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractPage' });

    if (response && response.success && response.data) {
      const prompt = generateQuickPrompt(response.data, 'page');
      const b12Url = createB12Url(prompt);
      chrome.tabs.create({ url: b12Url });
    }
  } catch (error) {
    console.error('Error generating from page:', error);
    // Open popup as fallback
    chrome.action.openPopup();
  }
}

/**
 * Generate a quick prompt from extracted data
 */
function generateQuickPrompt(data, type) {
  let prompt = '';

  if (type === 'selection') {
    prompt = 'Create a website with the following content:\n\n';
    if (data.text) {
      prompt += data.text.substring(0, 1000);
    }
    prompt += '\n\nMake it modern, responsive, and professional.';
  } else if (type === 'page') {
    prompt = `Create a website similar to: ${data.url}\n\n`;
    if (data.title) {
      prompt += `Title: ${data.title}\n\n`;
    }
    if (data.mainContent) {
      prompt += `Main content:\n${data.mainContent.substring(0, 800)}\n\n`;
    }
    prompt += 'Make it modern, responsive, and professional with similar structure and style.';
  }

  return prompt;
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
  }
  return true;
});

// Handle keyboard shortcuts (if defined in manifest)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'quick-generate') {
    chrome.action.openPopup();
  }
});
