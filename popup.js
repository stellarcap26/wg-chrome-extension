// Popup script for Website Generator extension

let currentPrompt = '';
let currentExtractedData = null;

// DOM elements
const extractPageBtn = document.getElementById('extractPage');
const uploadImageBtn = document.getElementById('uploadImage');
const imageInput = document.getElementById('imageInput');
const pasteArea = document.getElementById('pasteArea');

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
const showFullContentCheckbox = document.getElementById('showFullContent');
const enhancePromptCheckbox = document.getElementById('enhancePrompt');

// Event listeners
extractPageBtn.addEventListener('click', () => extractMultiPageContent());
uploadImageBtn.addEventListener('click', () => {
  imageInput.click();
  pasteArea.classList.remove('hidden');
});
imageInput.addEventListener('change', handleImageUpload);

// Add paste support
document.addEventListener('paste', handlePaste);
pasteArea.addEventListener('click', () => {
  pasteArea.classList.add('hidden');
});

generateBtn.addEventListener('click', generateWebsite);
copyBtn.addEventListener('click', copyPrompt);
editBtn.addEventListener('click', showEditMode);
saveEditBtn.addEventListener('click', saveEdit);
cancelEditBtn.addEventListener('click', hideEditMode);

/**
 * Extract content from multiple pages (up to 5)
 */
async function extractMultiPageContent() {
  try {
    showStatus('🔍 Analyzing website structure...', 'info');

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      showStatus('❌ Could not access current tab', 'error');
      return;
    }

    // Extract current page
    showStatus('📄 Extracting page 1... this is exciting!', 'info');
    const currentPageResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractPage' });

    if (!currentPageResponse || !currentPageResponse.success) {
      showStatus('❌ Failed to extract content: ' + (currentPageResponse?.error || 'Unknown error'), 'error');
      return;
    }

    const pages = [currentPageResponse.data];

    // Get navigation links
    showStatus('🔗 Finding related pages...', 'info');
    const navLinksResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getNavigationLinks' });

    if (navLinksResponse && navLinksResponse.success && navLinksResponse.data) {
      const navLinks = navLinksResponse.data.slice(0, 4); // Get up to 4 more pages

      // Extract content from additional pages
      for (let i = 0; i < navLinks.length; i++) {
        try {
          showStatus(`📄 Extracting page ${i + 2} of ${navLinks.length + 1}... hang tight!`, 'info');

          // Create temporary tab to extract content
          const newTab = await chrome.tabs.create({ url: navLinks[i].url, active: false });

          // Wait for page to load
          await new Promise(resolve => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === newTab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
              }
            });

            // Timeout after 5 seconds
            setTimeout(resolve, 5000);
          });

          // Extract content
          const pageResponse = await chrome.tabs.sendMessage(newTab.id, { action: 'extractPage' });

          if (pageResponse && pageResponse.success) {
            pages.push({
              ...pageResponse.data,
              navLinkText: navLinks[i].text
            });
          }

          // Close the temporary tab
          await chrome.tabs.remove(newTab.id);

        } catch (error) {
          console.error(`Error extracting page ${i + 2}:`, error);
        }
      }
    }

    showStatus('✨ Crafting your perfect prompt...', 'info');

    currentExtractedData = {
      multiPage: true,
      pages: pages,
      totalPages: pages.length
    };

    // Generate prompt based on extracted data
    const prompt = generateMultiPagePrompt(currentExtractedData);
    currentPrompt = prompt;

    // Show preview
    promptPreview.textContent = prompt;
    previewDiv.classList.remove('hidden');
    statusDiv.classList.add('hidden');

  } catch (error) {
    console.error('Extraction error:', error);
    showStatus('❌ Oops! Error: ' + error.message, 'error');
  }
}

/**
 * Handle paste event for images
 */
async function handlePaste(event) {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      event.preventDefault();
      const blob = items[i].getAsFile();
      processImageFile(blob);
      pasteArea.classList.add('hidden');
      showStatus('🎉 Image pasted! Creating your prompt...', 'info');
      break;
    }
  }
}

/**
 * Process image file (from paste or upload)
 */
async function processImageFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showStatus('Please paste or upload a valid image file', 'error');
    return;
  }

  try {
    showStatus('✨ Processing your masterpiece...', 'info');

    // Read image as data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;

      // Create prompt for mockup/screenshot
      let prompt = '🎨 Create a website that EXACTLY matches the provided mockup/screenshot.\n\n';
      prompt += 'CRITICAL REQUIREMENTS:\n\n';
      prompt += 'Visual Design:\n';
      prompt += '- Replicate the EXACT layout shown in the mockup down to pixel-perfect precision\n';
      prompt += '- Match all colors, gradients, and color schemes precisely\n';
      prompt += '- Use the same typography, font sizes, and text hierarchy\n';
      prompt += '- Recreate all visual effects: shadows, borders, rounded corners, overlays\n';
      prompt += '- Match spacing, padding, and margins exactly as shown\n';
      prompt += '- Implement any animations or transitions visible in the mockup\n\n';

      prompt += 'Components & Elements:\n';
      prompt += '- Include every section, component, and UI element from the mockup\n';
      prompt += '- Recreate all buttons with exact styling (colors, shapes, hover states)\n';
      prompt += '- Implement all navigation elements (menus, dropdowns, breadcrumbs)\n';
      prompt += '- Add all form fields with proper styling and validation\n';
      prompt += '- Include all cards, panels, and content containers\n';
      prompt += '- Replicate any icons, badges, or decorative elements\n\n';

      prompt += 'Images & Media:\n';
      prompt += '- Use placeholder images that match the dimensions shown\n';
      prompt += '- Maintain the same aspect ratios and image treatments\n';
      prompt += '- Include any background images or patterns\n';
      prompt += '- Add video placeholders if videos are shown in the mockup\n\n';

      prompt += 'Responsiveness:\n';
      prompt += '- Make the design fully responsive and mobile-friendly\n';
      prompt += '- Ensure the layout adapts gracefully to different screen sizes\n';
      prompt += '- Maintain the design integrity on tablets and mobile devices\n\n';

      prompt += 'Interactivity:\n';
      prompt += '- Implement any interactive elements visible (sliders, accordions, tabs)\n';
      prompt += '- Add appropriate hover effects on clickable elements\n';
      prompt += '- Ensure smooth transitions and animations\n';
      prompt += '- Make all buttons and links functional\n\n';

      prompt += 'Performance:\n';
      prompt += '- Optimize all assets for fast loading\n';
      prompt += '- Use modern web best practices\n';
      prompt += '- Ensure cross-browser compatibility\n';
      prompt += '- Follow accessibility guidelines\n\n';

      prompt += 'Content:\n';
      prompt += '- Use readable placeholder text where text is not clearly visible\n';
      prompt += '- Maintain content hierarchy and organization from the mockup\n';
      prompt += '- Preserve the tone and messaging style\n\n';

      prompt += '✨ Note: This website is based on a design mockup/screenshot. ';
      prompt += 'The goal is to create a pixel-perfect recreation that matches the visual design exactly.\n';

      currentPrompt = prompt;
      currentExtractedData = { type: 'image', imageData };

      // Show preview
      promptPreview.textContent = prompt;
      previewDiv.classList.remove('hidden');
      statusDiv.classList.add('hidden');
    };

    reader.readAsDataURL(file);

  } catch (error) {
    showStatus('❌ Error processing image: ' + error.message, 'error');
  }
}

/**
 * Generate comprehensive multi-page prompt
 */
function generateMultiPagePrompt(data) {
  const options = {
    includeStyles: includeStylesCheckbox.checked,
    includeImages: includeImagesCheckbox.checked,
    includeLayout: includeLayoutCheckbox.checked,
    showFullContent: showFullContentCheckbox.checked,
    enhance: enhancePromptCheckbox.checked
  };

  let prompt = '';

  // Main page (first page)
  const mainPage = data.pages[0];

  prompt += `🌐 Create a comprehensive website based on: ${mainPage.url}\n\n`;

  if (mainPage.title) {
    prompt += `Website Title: ${mainPage.title}\n\n`;
  }

  if (mainPage.meta && mainPage.meta.description) {
    prompt += `Description: ${mainPage.meta.description}\n\n`;
  }

  // Multi-page structure
  if (data.totalPages > 1) {
    prompt += `📚 MULTI-PAGE WEBSITE (${data.totalPages} pages):\n\n`;

    data.pages.forEach((page, index) => {
      const pageNum = index + 1;
      const pageName = page.navLinkText || (index === 0 ? 'Home' : `Page ${pageNum}`);

      prompt += `${'='.repeat(60)}\n`;
      prompt += `PAGE ${pageNum}: ${pageName}\n`;
      prompt += `${'='.repeat(60)}\n`;
      prompt += `URL: ${page.url}\n\n`;

      // If showFullContent is enabled, provide detailed section-by-section analysis
      if (options.showFullContent) {
        prompt += `📋 DETAILED PAGE STRUCTURE:\n\n`;

        // Page sections with full content
        if (page.headings && page.headings.length > 0) {
          prompt += `SECTIONS & CONTENT:\n\n`;

          // Group content by sections (H1, H2 headings)
          const sections = [];
          let currentSection = null;

          page.headings.forEach(heading => {
            if (heading.level === 1 || heading.level === 2) {
              if (currentSection) {
                sections.push(currentSection);
              }
              currentSection = {
                title: heading.text,
                level: heading.level,
                subheadings: []
              };
            } else if (currentSection && heading.level > 2) {
              currentSection.subheadings.push(heading);
            }
          });
          if (currentSection) sections.push(currentSection);

          // Output each section with full details
          sections.forEach((section, sIdx) => {
            prompt += `\n${sIdx + 1}. ${section.level === 1 ? 'SECTION' : 'Subsection'}: "${section.title}"\n`;
            prompt += `${'─'.repeat(50)}\n`;

            if (section.subheadings.length > 0) {
              prompt += `Subsections:\n`;
              section.subheadings.forEach(sub => {
                prompt += `${'  '.repeat(sub.level - 2)}- ${sub.text}\n`;
              });
              prompt += '\n';
            }
          });
        }

        // Full content extraction (not just summary)
        if (page.mainContent) {
          prompt += `\nFULL PAGE CONTENT:\n`;
          prompt += `${'─'.repeat(50)}\n`;
          // Include more content for detailed view
          const contentLimit = options.showFullContent ? 2000 : 400;
          const fullContent = page.mainContent.substring(0, contentLimit);
          prompt += `${fullContent}${page.mainContent.length > contentLimit ? '...' : ''}\n\n`;
        }

        // Detailed layout structure for this page
        if (page.layout) {
          prompt += `LAYOUT STRUCTURE:\n`;
          if (page.layout.hasHeader) prompt += `- Header: ${page.layout.hasHeader ? 'Present with logo and navigation' : 'None'}\n`;
          if (page.layout.hasNavigation) prompt += `- Navigation: ${page.layout.hasNavigation ? 'Main menu with links' : 'None'}\n`;
          if (page.layout.hasSidebar) prompt += `- Sidebar: ${page.layout.hasSidebar ? 'Present' : 'None'}\n`;
          if (page.layout.hasFooter) prompt += `- Footer: ${page.layout.hasFooter ? 'Present with additional info' : 'None'}\n`;
          prompt += '\n';
        }

        // Detailed styling for this page
        if (options.includeStyles && page.colors && page.colors.length > 0) {
          prompt += `STYLE DETAILS:\n`;
          prompt += `Colors used: ${page.colors.slice(0, 8).join(', ')}\n`;
          if (page.fonts && page.fonts.length > 0) {
            prompt += `Fonts: ${page.fonts.slice(0, 5).join(', ')}\n`;
          }
          prompt += '\n';
        }

      } else {
        // Standard summary view
        // Page structure
        if (page.headings && page.headings.length > 0) {
          prompt += `Main Sections:\n`;
          const mainHeadings = page.headings.filter(h => h.level <= 2).slice(0, 6);
          mainHeadings.forEach(heading => {
            prompt += `${'  '.repeat(heading.level - 1)}- ${heading.text}\n`;
          });
          prompt += '\n';
        }

        // Page content summary
        if (page.mainContent) {
          const contentPreview = page.mainContent.substring(0, 400);
          prompt += `Content Summary:\n${contentPreview}${page.mainContent.length > 400 ? '...' : ''}\n\n`;
        }
      }

      // Forms on this page
      if (page.forms && page.forms.length > 0) {
        prompt += `FORMS:\n`;
        page.forms.forEach((form, fIdx) => {
          prompt += `Form ${fIdx + 1}: ${form.fields.length} fields\n`;
          const fields = form.fields.slice(0, 10).map(f => `  - ${f.label || f.type}${f.required ? ' (required)' : ''}`).join('\n');
          prompt += fields + '\n';
        });
        prompt += '\n';
      }

      // Tables on this page
      if (page.tables && page.tables.length > 0) {
        prompt += `TABLES: ${page.tables.length} data table(s)\n`;
        page.tables.forEach((table, tIdx) => {
          if (table.headers && table.headers.length > 0) {
            prompt += `Table ${tIdx + 1}: Columns: ${table.headers.join(', ')}\n`;
          }
        });
        prompt += '\n';
      }

      prompt += '\n';
    });
  }

  // Overall layout and structure
  if (options.includeLayout && mainPage.layout) {
    prompt += `WEBSITE STRUCTURE:\n\n`;

    if (mainPage.layout.hasHeader) prompt += '- Fixed/sticky header with logo and navigation\n';
    if (mainPage.layout.hasNavigation) {
      prompt += `- Main navigation menu`;
      if (data.totalPages > 1) {
        const navPages = data.pages.map(p => p.navLinkText || p.title).filter(Boolean);
        prompt += ` with pages: ${navPages.join(', ')}`;
      }
      prompt += '\n';
    }
    if (mainPage.layout.hasSidebar) prompt += '- Sidebar navigation or content\n';
    if (mainPage.layout.hasFooter) prompt += '- Footer with additional links and information\n';

    prompt += '\n';
  }

  // Images - Detailed descriptions
  if (options.includeImages && mainPage.images) {
    prompt += `IMAGES & VISUAL ASSETS:\n\n`;

    if (mainPage.images.heroImage) {
      const hero = mainPage.images.heroImage;
      prompt += `Hero/Banner Image:\n`;
      prompt += `- Large ${hero.width}x${hero.height}px image (aspect ratio: ${hero.aspectRatio})\n`;
      if (hero.alt) prompt += `- Purpose: ${hero.alt}\n`;
      prompt += `- Context: ${hero.context}\n`;
      if (hero.objectFit !== 'fill') prompt += `- Display style: ${hero.objectFit}\n`;
      if (hero.filter !== 'none') prompt += `- Visual effects: ${hero.filter}\n`;
      prompt += '\n';
    }

    const totalImages = mainPage.images.totalCount;
    prompt += `Total Images: ${totalImages} images across the website\n`;

    if (mainPage.images.images && mainPage.images.images.length > 0) {
      prompt += `\nImage Details:\n`;
      mainPage.images.images.slice(0, 10).forEach((img, i) => {
        prompt += `${i + 1}. ${img.context}`;
        if (img.alt) prompt += ` - "${img.alt}"`;
        prompt += ` (${img.width}x${img.height}px, ratio: ${img.aspectRatio})`;
        if (img.borderRadius && img.borderRadius !== '0px') prompt += ` - rounded corners`;
        if (img.boxShadow !== 'no shadow') prompt += ` - with shadow effect`;
        prompt += '\n';
      });
      prompt += '\n';
    }

    if (mainPage.images.backgroundImages && mainPage.images.backgroundImages.length > 0) {
      prompt += `Background Images: ${mainPage.images.backgroundImages.length} section backgrounds\n`;
      prompt += `Background styles: ${mainPage.images.backgroundImages[0].size}, ${mainPage.images.backgroundImages[0].repeat}\n\n`;
    }
  }

  // Animations and interactions
  if (mainPage.animations) {
    prompt += `ANIMATIONS & INTERACTIONS:\n\n`;
    prompt += `${mainPage.animations.summary}\n\n`;

    if (mainPage.animations.cssAnimations && mainPage.animations.cssAnimations.length > 0) {
      prompt += `Key Animations:\n`;
      mainPage.animations.cssAnimations.slice(0, 5).forEach(anim => {
        prompt += `- ${anim.element}: ${anim.name} animation (${anim.duration}, ${anim.iterationCount} iterations)\n`;
      });
      prompt += '\n';
    }

    if (mainPage.animations.scrollAnimations && mainPage.animations.scrollAnimations.length > 0) {
      prompt += `Scroll-Triggered Animations:\n`;
      prompt += `- ${mainPage.animations.scrollAnimations.length} elements animate on scroll (fade-in, slide-in effects)\n\n`;
    }

    if (mainPage.animations.hoverEffects && mainPage.animations.hoverEffects.length > 0) {
      prompt += `Interactive Hover Effects:\n`;
      mainPage.animations.hoverEffects.slice(0, 5).forEach(effect => {
        prompt += `- ${effect.element}: transitions on ${effect.properties}\n`;
      });
      prompt += '\n';
    }
  }

  // Interactive elements
  if (mainPage.interactiveElements) {
    prompt += `INTERACTIVE COMPONENTS:\n\n`;
    prompt += `${mainPage.interactiveElements.summary}\n`;

    if (mainPage.interactiveElements.carousels && mainPage.interactiveElements.carousels.length > 0) {
      mainPage.interactiveElements.carousels.forEach(carousel => {
        prompt += `- Image/content carousel with ${carousel.slides} slides`;
        if (carousel.autoplay) prompt += ' (auto-playing)';
        prompt += '\n';
      });
    }

    if (mainPage.interactiveElements.accordions && mainPage.interactiveElements.accordions[0].count > 0) {
      prompt += `- ${mainPage.interactiveElements.accordions[0].count} accordion sections for expandable content\n`;
    }

    if (mainPage.interactiveElements.tabs && mainPage.interactiveElements.tabs[0].count > 0) {
      prompt += `- ${mainPage.interactiveElements.tabs[0].count} tabbed content sections\n`;
    }

    if (mainPage.interactiveElements.modals && mainPage.interactiveElements.modals[0].count > 0) {
      prompt += `- ${mainPage.interactiveElements.modals[0].count} modal popups/lightboxes\n`;
    }

    if (mainPage.interactiveElements.videoPlayers && mainPage.interactiveElements.videoPlayers[0].count > 0) {
      prompt += `- ${mainPage.interactiveElements.videoPlayers[0].count} embedded video players\n`;
    }

    prompt += '\n';
  }

  // Color scheme and styling
  if (options.includeStyles) {
    if (mainPage.colors && mainPage.colors.length > 0) {
      prompt += `COLOR SCHEME:\n`;
      prompt += `Primary colors: ${mainPage.colors.slice(0, 5).join(', ')}\n`;
      prompt += `Use a cohesive color palette that matches this scheme\n\n`;
    }

    if (mainPage.fonts && mainPage.fonts.length > 0) {
      prompt += `TYPOGRAPHY:\n`;
      prompt += `Font families: ${mainPage.fonts.slice(0, 3).join(', ')}\n`;
      prompt += `Use modern, readable fonts with clear hierarchy\n\n`;
    }
  }

  // Tables
  if (mainPage.tables && mainPage.tables.length > 0) {
    prompt += `DATA TABLES:\n`;
    prompt += `Include ${mainPage.tables.length} structured data table(s)\n\n`;
  }

  // Enhancement requirements
  if (options.enhance) {
    prompt += `ADDITIONAL REQUIREMENTS:\n\n`;
    prompt += `Design & UX:\n`;
    prompt += `- Create a modern, professional design that matches the reference website\n`;
    prompt += `- Ensure full mobile responsiveness across all pages\n`;
    prompt += `- Implement smooth page transitions and micro-interactions\n`;
    prompt += `- Use consistent spacing, typography, and visual hierarchy\n`;
    prompt += `- Optimize images for web performance (lazy loading, proper sizing)\n\n`;

    prompt += `Functionality:\n`;
    prompt += `- Implement all interactive elements (carousels, accordions, modals, etc.)\n`;
    prompt += `- Add smooth scroll animations and transitions\n`;
    prompt += `- Ensure fast loading times with optimized assets\n`;
    prompt += `- Make all forms functional with proper validation\n`;
    prompt += `- Include SEO-friendly structure and meta tags\n\n`;

    prompt += `Animations:\n`;
    prompt += `- Replicate the animation style from the reference site\n`;
    prompt += `- Use scroll-triggered animations for engaging user experience\n`;
    prompt += `- Add subtle hover effects on interactive elements\n`;
    prompt += `- Ensure animations are smooth and performant\n\n`;
  }

  return prompt.trim();
}

/**
 * Handle image upload for mockups/screenshots
 */
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  processImageFile(file);
  pasteArea.classList.add('hidden');
}

/**
 * Generate B12 website
 */
function generateWebsite() {
  if (!currentPrompt) {
    showStatus('❌ No prompt available', 'error');
    return;
  }

  const b12Url = createB12Url(currentPrompt);

  // Open B12 in new tab
  chrome.tabs.create({ url: b12Url });

  // Show success message
  showStatus('🚀 Opening B12 website builder... let\'s make magic!', 'success');

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
    showStatus('📋 Prompt copied to clipboard! You\'re all set!', 'success');
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 2000);
  } catch (error) {
    showStatus('❌ Failed to copy: ' + error.message, 'error');
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
    showStatus('❌ Prompt cannot be empty', 'error');
    return;
  }

  promptPreview.textContent = currentPrompt;
  hideEditMode();
  previewDiv.classList.remove('hidden');
  showStatus('✅ Edits saved! Looking good!', 'success');
  setTimeout(() => {
    statusDiv.classList.add('hidden');
  }, 2000);
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
    showFullContent: true,
    enhancePrompt: true
  }, (items) => {
    includeStylesCheckbox.checked = items.includeStyles;
    includeImagesCheckbox.checked = items.includeImages;
    includeLayoutCheckbox.checked = items.includeLayout;
    showFullContentCheckbox.checked = items.showFullContent;
    enhancePromptCheckbox.checked = items.enhancePrompt;
  });

  // Save options when changed
  [includeStylesCheckbox, includeImagesCheckbox, includeLayoutCheckbox, showFullContentCheckbox, enhancePromptCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      chrome.storage.sync.set({
        includeStyles: includeStylesCheckbox.checked,
        includeImages: includeImagesCheckbox.checked,
        includeLayout: includeLayoutCheckbox.checked,
        showFullContent: showFullContentCheckbox.checked,
        enhancePrompt: enhancePromptCheckbox.checked
      });
    });
  });
});
