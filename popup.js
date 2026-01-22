// Popup script for Website Generator extension

let currentPrompt = '';
let currentExtractedData = null;

// DOM elements
const extractSelectedBtn = document.getElementById('extractSelected');
const extractPageBtn = document.getElementById('extractPage');
const extractVisibleBtn = document.getElementById('extractVisible');
const uploadImageBtn = document.getElementById('uploadImage');
const imageInput = document.getElementById('imageInput');

const statusDiv = document.getElementById('status');
const previewDiv = document.getElementById('preview');
const promptPreview = document.getElementById('promptPreview');
const editModeDiv = document.getElementById('editMode');
const promptEditor = document.getElementById('promptEditor');

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const editBtn = document.getElementById('editBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Advanced options
const includeStylesCheckbox = document.getElementById('includeStyles');
const includeImagesCheckbox = document.getElementById('includeImages');
const includeLayoutCheckbox = document.getElementById('includeLayout');
const enhancePromptCheckbox = document.getElementById('enhancePrompt');

// Event listeners
extractSelectedBtn.addEventListener('click', () => extractContent('extractSelected'));
extractPageBtn.addEventListener('click', () => extractContent('extractPage'));
extractVisibleBtn.addEventListener('click', () => extractContent('extractVisible'));
uploadImageBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', handleImageUpload);

generateBtn.addEventListener('click', generateWebsite);
copyBtn.addEventListener('click', copyPrompt);
editBtn.addEventListener('click', showEditMode);
saveEditBtn.addEventListener('click', saveEdit);
cancelEditBtn.addEventListener('click', hideEditMode);

/**
 * Extract content from current tab
 */
async function extractContent(action) {
  try {
    showStatus('Extracting content...', 'info');

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      showStatus('Could not access current tab', 'error');
      return;
    }

    // Inject content script if needed and extract content
    const response = await chrome.tabs.sendMessage(tab.id, { action });

    if (!response || !response.success) {
      showStatus('Failed to extract content: ' + (response?.error || 'Unknown error'), 'error');
      return;
    }

    currentExtractedData = response.data;

    if (!currentExtractedData) {
      showStatus('No content found. Please select some content first.', 'error');
      return;
    }

    // Generate prompt based on extracted data
    const prompt = generatePrompt(currentExtractedData, action);
    currentPrompt = prompt;

    // Show preview
    promptPreview.textContent = prompt;
    previewDiv.classList.remove('hidden');
    statusDiv.classList.add('hidden');

  } catch (error) {
    console.error('Extraction error:', error);
    showStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Generate B12 prompt from extracted data
 */
function generatePrompt(data, action) {
  const options = {
    includeStyles: includeStylesCheckbox.checked,
    includeImages: includeImagesCheckbox.checked,
    includeLayout: includeLayoutCheckbox.checked,
    enhance: enhancePromptCheckbox.checked
  };

  let prompt = '';

  switch (action) {
    case 'extractSelected':
      prompt = generateSelectedContentPrompt(data, options);
      break;
    case 'extractPage':
      prompt = generateFullPagePrompt(data, options);
      break;
    case 'extractVisible':
      prompt = generateVisibleContentPrompt(data, options);
      break;
  }

  return prompt;
}

/**
 * Generate prompt for selected content
 */
function generateSelectedContentPrompt(data, options) {
  let prompt = 'Create a website with the following content:\n\n';

  // Add text content
  if (data.text) {
    prompt += `Content:\n${data.text}\n\n`;
  }

  // Add table data
  if (data.tables && data.tables.length > 0) {
    prompt += 'The website should include the following data in a structured format:\n\n';
    data.tables.forEach((table, index) => {
      prompt += `Table ${index + 1}:\n`;
      if (table.headers.length > 0) {
        prompt += `Columns: ${table.headers.join(', ')}\n`;
      }
      prompt += `Rows: ${table.rows.length} rows of data\n`;
      if (table.rows.length > 0 && table.rows.length <= 5) {
        prompt += 'Sample data:\n';
        table.rows.forEach(row => {
          prompt += `- ${row.join(' | ')}\n`;
        });
      }
      prompt += '\n';
    });
  }

  // Add images
  if (options.includeImages && data.images && data.images.length > 0) {
    prompt += `Include ${data.images.length} image${data.images.length > 1 ? 's' : ''} with the following descriptions:\n`;
    data.images.forEach((img, index) => {
      prompt += `${index + 1}. ${img.alt || 'Image'} (${img.width}x${img.height})\n`;
    });
    prompt += '\n';
  }

  // Add links
  if (data.links && data.links.length > 0) {
    const importantLinks = data.links.slice(0, 5);
    if (importantLinks.length > 0) {
      prompt += `Important links to include:\n`;
      importantLinks.forEach(link => {
        if (link.text) {
          prompt += `- ${link.text}\n`;
        }
      });
      prompt += '\n';
    }
  }

  if (options.enhance) {
    prompt += 'Design requirements:\n';
    prompt += '- Make the design modern, clean, and professional\n';
    prompt += '- Ensure the website is mobile-responsive\n';
    prompt += '- Use appropriate typography and spacing\n';
    prompt += '- Include clear calls-to-action where relevant\n';
  }

  return prompt.trim();
}

/**
 * Generate prompt for full page clone
 */
function generateFullPagePrompt(data, options) {
  let prompt = `Create a website similar to ${data.url}\n\n`;

  // Add title and description
  if (data.title) {
    prompt += `Website name: ${data.title}\n\n`;
  }

  if (data.meta && data.meta.description) {
    prompt += `Description: ${data.meta.description}\n\n`;
  }

  // Add structure
  prompt += 'Website structure:\n\n';

  // Layout
  if (options.includeLayout && data.layout) {
    if (data.layout.hasHeader) {
      prompt += '- Header with navigation\n';
    }
    if (data.layout.hasNavigation) {
      prompt += '- Main navigation menu\n';
    }
    if (data.layout.hasSidebar) {
      prompt += '- Sidebar section\n';
    }

    if (data.layout.sections && data.layout.sections.length > 0) {
      prompt += '\nMain sections:\n';
      data.layout.sections.forEach((section, index) => {
        prompt += `${index + 1}. ${section.title}`;
        if (section.hasImages) prompt += ' (with images)';
        if (section.hasForm) prompt += ' (with form)';
        prompt += '\n';
      });
      prompt += '\n';
    }

    if (data.layout.hasFooter) {
      prompt += '- Footer section\n';
    }
  }

  // Headings
  if (data.headings && data.headings.length > 0) {
    prompt += '\nKey content sections:\n';
    const mainHeadings = data.headings.filter(h => h.level <= 2).slice(0, 8);
    mainHeadings.forEach(heading => {
      prompt += `- ${heading.text}\n`;
    });
    prompt += '\n';
  }

  // Main content
  if (data.mainContent) {
    const contentPreview = data.mainContent.substring(0, 500);
    prompt += `Content overview:\n${contentPreview}${data.mainContent.length > 500 ? '...' : ''}\n\n`;
  }

  // Forms
  if (data.forms && data.forms.length > 0) {
    prompt += `Include ${data.forms.length} form${data.forms.length > 1 ? 's' : ''} with the following fields:\n`;
    data.forms.forEach((form, index) => {
      prompt += `Form ${index + 1}: `;
      const fieldTypes = form.fields.map(f => f.label || f.type).filter(Boolean);
      prompt += fieldTypes.slice(0, 5).join(', ');
      if (fieldTypes.length > 5) prompt += `, and ${fieldTypes.length - 5} more fields`;
      prompt += '\n';
    });
    prompt += '\n';
  }

  // Images
  if (options.includeImages && data.images && data.images.length > 0) {
    prompt += `Include approximately ${Math.min(data.images.length, 20)} images throughout the website\n\n`;
  }

  // Tables
  if (data.tables && data.tables.length > 0) {
    prompt += `Include ${data.tables.length} data table${data.tables.length > 1 ? 's' : ''}\n\n`;
  }

  // Styling
  if (options.includeStyles) {
    if (data.colors && data.colors.length > 0) {
      prompt += `Color scheme: Use colors similar to ${data.colors.slice(0, 3).join(', ')}\n`;
    }
    if (data.fonts && data.fonts.length > 0) {
      prompt += `Typography: Use modern fonts similar to ${data.fonts.slice(0, 2).join(', ')}\n`;
    }
    prompt += '\n';
  }

  if (options.enhance) {
    prompt += 'Additional requirements:\n';
    prompt += '- Ensure the website is fully responsive and mobile-friendly\n';
    prompt += '- Implement modern design patterns and best practices\n';
    prompt += '- Include smooth transitions and interactions\n';
    prompt += '- Optimize for fast loading and performance\n';
    prompt += '- Make the design accessible and user-friendly\n';
  }

  return prompt.trim();
}

/**
 * Generate prompt for visible content
 */
function generateVisibleContentPrompt(data, options) {
  let prompt = `Create a website based on the following visible content from ${data.url}:\n\n`;

  if (data.visibleText) {
    const textPreview = data.visibleText.substring(0, 800);
    prompt += `Main content:\n${textPreview}${data.visibleText.length > 800 ? '...' : ''}\n\n`;
  }

  if (data.visibleElements) {
    if (data.visibleElements.headings && data.visibleElements.headings.length > 0) {
      prompt += 'Main headings:\n';
      data.visibleElements.headings.slice(0, 5).forEach(heading => {
        prompt += `- ${heading}\n`;
      });
      prompt += '\n';
    }

    if (data.visibleElements.buttons && data.visibleElements.buttons.length > 0) {
      prompt += 'Call-to-action buttons:\n';
      data.visibleElements.buttons.slice(0, 5).forEach(button => {
        if (button) prompt += `- ${button}\n`;
      });
      prompt += '\n';
    }
  }

  if (options.includeImages && data.visibleImages && data.visibleImages.length > 0) {
    prompt += `Include ${data.visibleImages.length} image${data.visibleImages.length > 1 ? 's' : ''} in this section\n\n`;
  }

  if (options.enhance) {
    prompt += 'Design requirements:\n';
    prompt += '- Create a modern, engaging design\n';
    prompt += '- Ensure mobile responsiveness\n';
    prompt += '- Use clear visual hierarchy\n';
    prompt += '- Include appropriate spacing and typography\n';
  }

  return prompt.trim();
}

/**
 * Handle image upload for mockups/screenshots
 */
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showStatus('Please upload a valid image file', 'error');
    return;
  }

  try {
    showStatus('Processing image...', 'info');

    // Read image as data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;

      // Create prompt for mockup/screenshot
      let prompt = 'Create a website based on the provided mockup/screenshot.\n\n';
      prompt += 'Requirements:\n';
      prompt += '- Replicate the layout and structure shown in the image\n';
      prompt += '- Match the visual style, colors, and typography as closely as possible\n';
      prompt += '- Ensure all sections, components, and elements from the mockup are included\n';
      prompt += '- Make the website fully responsive and mobile-friendly\n';
      prompt += '- Use modern web design best practices\n';
      prompt += '- Implement any forms, buttons, or interactive elements shown\n';
      prompt += '- Include placeholder content where text is not clearly visible\n';
      prompt += '- Optimize images and assets for web performance\n\n';
      prompt += 'Note: This is based on a visual mockup/screenshot provided by the user.\n';

      currentPrompt = prompt;
      currentExtractedData = { type: 'image', imageData };

      // Show preview
      promptPreview.textContent = prompt;
      previewDiv.classList.remove('hidden');
      statusDiv.classList.add('hidden');
    };

    reader.readAsDataURL(file);

  } catch (error) {
    showStatus('Error processing image: ' + error.message, 'error');
  }
}

/**
 * Generate B12 website
 */
function generateWebsite() {
  if (!currentPrompt) {
    showStatus('No prompt available', 'error');
    return;
  }

  const b12Url = createB12Url(currentPrompt);

  // Open B12 in new tab
  chrome.tabs.create({ url: b12Url });

  // Show success message
  showStatus('Opening B12 website builder...', 'success');

  // Close popup after a short delay
  setTimeout(() => {
    window.close();
  }, 1000);
}

/**
 * Create B12 URL with encoded prompt
 */
function createB12Url(prompt) {
  const baseUrl = 'https://b12.io/signup/';
  const encodedPrompt = encodeURIComponent(prompt);
  return `${baseUrl}?business_description=${encodedPrompt}`;
}

/**
 * Copy prompt to clipboard
 */
async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(currentPrompt);
    showStatus('Prompt copied to clipboard!', 'success');
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 2000);
  } catch (error) {
    showStatus('Failed to copy: ' + error.message, 'error');
  }
}

/**
 * Show edit mode
 */
function showEditMode() {
  promptEditor.value = currentPrompt;
  previewDiv.classList.add('hidden');
  editModeDiv.classList.remove('hidden');
  promptEditor.focus();
}

/**
 * Save edited prompt
 */
function saveEdit() {
  currentPrompt = promptEditor.value.trim();
  if (!currentPrompt) {
    showStatus('Prompt cannot be empty', 'error');
    return;
  }

  promptPreview.textContent = currentPrompt;
  hideEditMode();
  previewDiv.classList.remove('hidden');
}

/**
 * Hide edit mode
 */
function hideEditMode() {
  editModeDiv.classList.add('hidden');
  previewDiv.classList.remove('hidden');
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.remove('hidden');
}

/**
 * Initialize popup
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load saved options
  chrome.storage.sync.get({
    includeStyles: true,
    includeImages: true,
    includeLayout: true,
    enhancePrompt: true
  }, (items) => {
    includeStylesCheckbox.checked = items.includeStyles;
    includeImagesCheckbox.checked = items.includeImages;
    includeLayoutCheckbox.checked = items.includeLayout;
    enhancePromptCheckbox.checked = items.enhancePrompt;
  });

  // Save options when changed
  [includeStylesCheckbox, includeImagesCheckbox, includeLayoutCheckbox, enhancePromptCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      chrome.storage.sync.set({
        includeStyles: includeStylesCheckbox.checked,
        includeImages: includeImagesCheckbox.checked,
        includeLayout: includeLayoutCheckbox.checked,
        enhancePrompt: enhancePromptCheckbox.checked
      });
    });
  });
});
