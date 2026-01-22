// Content script that extracts content from web pages

/**
 * Get selected content (text, images, tables, etc.)
 */
function getSelectedContent() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText && selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeCount() > 0 ? selection.getRangeAt(0) : null;
  const container = range ? range.commonAncestorContainer : null;

  let result = {
    text: selectedText,
    html: '',
    images: [],
    tables: [],
    links: [],
    type: 'text'
  };

  if (range && container) {
    const fragment = range.cloneContents();
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(fragment);

    result.html = tempDiv.innerHTML;

    // Extract images
    const images = tempDiv.querySelectorAll('img');
    result.images = Array.from(images).map(img => ({
      src: img.src,
      alt: img.alt || '',
      width: img.width,
      height: img.height
    }));

    // Extract tables
    const tables = tempDiv.querySelectorAll('table');
    result.tables = Array.from(tables).map(table => extractTableData(table));

    // Extract links
    const links = tempDiv.querySelectorAll('a');
    result.links = Array.from(links).map(a => ({
      text: a.textContent.trim(),
      href: a.href
    }));

    // Determine content type
    if (result.tables.length > 0) {
      result.type = 'table';
    } else if (result.images.length > 0) {
      result.type = 'mixed';
    }
  }

  return result;
}

/**
 * Extract entire page content
 */
function getPageContent() {
  const result = {
    title: document.title,
    url: window.location.href,
    meta: extractMetaData(),
    headings: extractHeadings(),
    mainContent: extractMainContent(),
    images: extractImagesDetailed(),
    links: extractLinks(),
    tables: extractTables(),
    forms: extractForms(),
    colors: extractColors(),
    fonts: extractFonts(),
    layout: analyzeLayout(),
    animations: detectAnimations(),
    interactiveElements: detectInteractiveElements(),
    type: 'full-page'
  };

  return result;
}

/**
 * Get visible content only
 */
function getVisibleContent() {
  const result = {
    title: document.title,
    url: window.location.href,
    visibleText: extractVisibleText(),
    visibleImages: extractVisibleImages(),
    visibleElements: analyzeVisibleElements(),
    type: 'visible'
  };

  return result;
}

/**
 * Extract table data into structured format
 */
function extractTableData(table) {
  const headers = [];
  const rows = [];

  const thead = table.querySelector('thead');
  if (thead) {
    const headerCells = thead.querySelectorAll('th, td');
    headerCells.forEach(cell => headers.push(cell.textContent.trim()));
  } else {
    // Try first row as headers
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('th, td');
      if (cells.length > 0 && cells[0].tagName === 'TH') {
        cells.forEach(cell => headers.push(cell.textContent.trim()));
      }
    }
  }

  const tbody = table.querySelector('tbody') || table;
  const tableRows = tbody.querySelectorAll('tr');

  tableRows.forEach((row, index) => {
    // Skip header row if we already got it
    if (index === 0 && headers.length > 0 && !table.querySelector('thead')) {
      return;
    }

    const cells = row.querySelectorAll('td, th');
    const rowData = [];
    cells.forEach(cell => rowData.push(cell.textContent.trim()));
    if (rowData.length > 0) {
      rows.push(rowData);
    }
  });

  return { headers, rows };
}

/**
 * Extract meta data
 */
function extractMetaData() {
  const meta = {};
  const metaTags = document.querySelectorAll('meta');

  metaTags.forEach(tag => {
    const name = tag.getAttribute('name') || tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (name && content) {
      meta[name] = content;
    }
  });

  return meta;
}

/**
 * Extract all headings with hierarchy
 */
function extractHeadings() {
  const headings = [];
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headingElements.forEach(heading => {
    if (isElementVisible(heading)) {
      headings.push({
        level: parseInt(heading.tagName.substring(1)),
        text: heading.textContent.trim()
      });
    }
  });

  return headings;
}

/**
 * Extract main content (try to avoid navigation, footer, etc.)
 */
function extractMainContent() {
  // Try semantic HTML5 elements first
  const main = document.querySelector('main');
  if (main) {
    return cleanText(main.textContent);
  }

  const article = document.querySelector('article');
  if (article) {
    return cleanText(article.textContent);
  }

  // Try common content container IDs/classes
  const contentSelectors = [
    '#content',
    '#main-content',
    '.content',
    '.main-content',
    '[role="main"]'
  ];

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return cleanText(element.textContent);
    }
  }

  // Fallback to body but exclude common non-content areas
  const body = document.body.cloneNode(true);
  const excludeSelectors = ['header', 'nav', 'footer', 'aside', '.sidebar', '.navigation'];

  excludeSelectors.forEach(selector => {
    const elements = body.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  return cleanText(body.textContent);
}

/**
 * Extract all images with metadata
 */
function extractImages() {
  const images = [];
  const imgElements = document.querySelectorAll('img');

  imgElements.forEach(img => {
    if (isElementVisible(img) && img.src && !img.src.startsWith('data:')) {
      images.push({
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        title: img.title || ''
      });
    }
  });

  return images;
}

/**
 * Extract visible images only
 */
function extractVisibleImages() {
  const images = [];
  const imgElements = document.querySelectorAll('img');

  imgElements.forEach(img => {
    if (isInViewport(img) && img.src && !img.src.startsWith('data:')) {
      images.push({
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      });
    }
  });

  return images;
}

/**
 * Extract links
 */
function extractLinks() {
  const links = [];
  const linkElements = document.querySelectorAll('a[href]');

  linkElements.forEach(link => {
    if (isElementVisible(link)) {
      links.push({
        text: link.textContent.trim(),
        href: link.href,
        title: link.title || ''
      });
    }
  });

  return links.slice(0, 50); // Limit to first 50 links
}

/**
 * Extract tables
 */
function extractTables() {
  const tables = [];
  const tableElements = document.querySelectorAll('table');

  tableElements.forEach(table => {
    if (isElementVisible(table)) {
      tables.push(extractTableData(table));
    }
  });

  return tables;
}

/**
 * Extract forms and their fields
 */
function extractForms() {
  const forms = [];
  const formElements = document.querySelectorAll('form');

  formElements.forEach(form => {
    const fields = [];
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      fields.push({
        type: input.type || input.tagName.toLowerCase(),
        name: input.name || '',
        placeholder: input.placeholder || '',
        label: findLabelForInput(input)
      });
    });

    if (fields.length > 0) {
      forms.push({ fields });
    }
  });

  return forms;
}

/**
 * Find label for input field
 */
function findLabelForInput(input) {
  // Try associated label
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent.trim();
  }

  // Try parent label
  const parentLabel = input.closest('label');
  if (parentLabel) {
    return parentLabel.textContent.replace(input.value, '').trim();
  }

  // Try preceding label
  const prevElement = input.previousElementSibling;
  if (prevElement && prevElement.tagName === 'LABEL') {
    return prevElement.textContent.trim();
  }

  return '';
}

/**
 * Extract color scheme
 */
function extractColors() {
  const colors = new Set();
  const elements = document.querySelectorAll('*');

  // Sample first 100 visible elements
  let count = 0;
  for (const element of elements) {
    if (count >= 100) break;
    if (!isElementVisible(element)) continue;

    const styles = window.getComputedStyle(element);
    const bgColor = styles.backgroundColor;
    const color = styles.color;

    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      colors.add(bgColor);
    }
    if (color) {
      colors.add(color);
    }

    count++;
  }

  return Array.from(colors).slice(0, 10);
}

/**
 * Extract font families
 */
function extractFonts() {
  const fonts = new Set();
  const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');

  elements.forEach(element => {
    if (isElementVisible(element)) {
      const fontFamily = window.getComputedStyle(element).fontFamily;
      if (fontFamily) {
        fonts.add(fontFamily.split(',')[0].replace(/['"]/g, '').trim());
      }
    }
  });

  return Array.from(fonts).slice(0, 5);
}

/**
 * Analyze page layout
 */
function analyzeLayout() {
  const layout = {
    hasHeader: !!document.querySelector('header, [role="banner"]'),
    hasFooter: !!document.querySelector('footer, [role="contentinfo"]'),
    hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
    hasSidebar: !!document.querySelector('aside, .sidebar'),
    sections: []
  };

  const sections = document.querySelectorAll('section, .section');
  sections.forEach(section => {
    const heading = section.querySelector('h1, h2, h3');
    if (heading && isElementVisible(section)) {
      layout.sections.push({
        title: heading.textContent.trim(),
        hasImages: section.querySelectorAll('img').length > 0,
        hasForm: section.querySelectorAll('form').length > 0
      });
    }
  });

  return layout;
}

/**
 * Extract visible text
 */
function extractVisibleText() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (node.parentElement && isInViewport(node.parentElement)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let text = '';
  let node;
  while (node = walker.nextNode()) {
    const trimmedText = node.textContent.trim();
    if (trimmedText) {
      text += trimmedText + ' ';
    }
  }

  return cleanText(text);
}

/**
 * Analyze visible elements
 */
function analyzeVisibleElements() {
  const elements = {
    buttons: [],
    headings: [],
    paragraphs: 0
  };

  document.querySelectorAll('button, .btn, [role="button"]').forEach(btn => {
    if (isInViewport(btn)) {
      elements.buttons.push(btn.textContent.trim());
    }
  });

  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    if (isInViewport(heading)) {
      elements.headings.push(heading.textContent.trim());
    }
  });

  document.querySelectorAll('p').forEach(p => {
    if (isInViewport(p)) {
      elements.paragraphs++;
    }
  });

  return elements;
}

/**
 * Check if element is visible
 */
function isElementVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' &&
         style.visibility !== 'hidden' &&
         style.opacity !== '0';
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  if (!isElementVisible(element)) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Extract detailed image information
 */
function extractImagesDetailed() {
  const images = [];
  const imgElements = document.querySelectorAll('img');

  imgElements.forEach(img => {
    if (isElementVisible(img) && img.src && !img.src.startsWith('data:')) {
      const styles = window.getComputedStyle(img);
      const rect = img.getBoundingClientRect();

      images.push({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        aspectRatio: (img.naturalWidth && img.naturalHeight) ?
          (img.naturalWidth / img.naturalHeight).toFixed(2) : null,
        loading: img.loading || 'eager',
        objectFit: styles.objectFit || 'fill',
        position: styles.position,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow !== 'none' ? 'has shadow' : 'no shadow',
        opacity: styles.opacity,
        filter: styles.filter !== 'none' ? styles.filter : 'none',
        context: describeImageContext(img),
        decorative: !img.alt && img.getAttribute('role') === 'presentation'
      });
    }
  });

  // Also check for background images
  const elementsWithBg = document.querySelectorAll('*');
  const backgroundImages = [];

  elementsWithBg.forEach(el => {
    if (!isElementVisible(el)) return;

    const styles = window.getComputedStyle(el);
    const bgImage = styles.backgroundImage;

    if (bgImage && bgImage !== 'none' && !bgImage.includes('gradient')) {
      const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        backgroundImages.push({
          url: urlMatch[1],
          element: el.tagName.toLowerCase(),
          size: styles.backgroundSize,
          position: styles.backgroundPosition,
          repeat: styles.backgroundRepeat,
          attachment: styles.backgroundAttachment
        });
      }
    }
  });

  return {
    images: images.slice(0, 50), // Limit to 50 images
    backgroundImages: backgroundImages.slice(0, 20),
    totalCount: images.length,
    heroImage: findHeroImage(images)
  };
}

/**
 * Describe image context
 */
function describeImageContext(img) {
  const parent = img.closest('figure, picture, a, div[class*="image"], div[class*="photo"]');

  if (!parent) return 'standalone';

  if (parent.tagName === 'A') return 'linked image';
  if (parent.tagName === 'FIGURE') {
    const caption = parent.querySelector('figcaption');
    return caption ? `figure with caption: ${caption.textContent.trim().substring(0, 100)}` : 'figure';
  }
  if (parent.tagName === 'PICTURE') return 'responsive picture';

  // Check if it's in a slider/carousel
  if (parent.closest('[class*="slider"], [class*="carousel"], [class*="gallery"]')) {
    return 'carousel/slider image';
  }

  // Check if it's in a hero section
  if (parent.closest('[class*="hero"], [class*="banner"], header')) {
    return 'hero/banner image';
  }

  return 'content image';
}

/**
 * Find hero/main image
 */
function findHeroImage(images) {
  // Look for the largest image in the top portion of the page
  const topImages = images.filter(img => {
    const imgElement = document.querySelector(`img[src="${img.src}"]`);
    if (!imgElement) return false;
    const rect = imgElement.getBoundingClientRect();
    return rect.top < window.innerHeight;
  });

  if (topImages.length === 0) return null;

  // Find largest image
  const largest = topImages.reduce((prev, current) => {
    const prevSize = (prev.width || 0) * (prev.height || 0);
    const currentSize = (current.width || 0) * (current.height || 0);
    return currentSize > prevSize ? current : prev;
  });

  return largest;
}

/**
 * Detect animations on the page
 */
function detectAnimations() {
  const animations = {
    cssAnimations: [],
    cssTransitions: [],
    scrollAnimations: [],
    hoverEffects: [],
    summary: ''
  };

  // Check all visible elements for animations
  const elements = document.querySelectorAll('*');
  const checkedSelectors = new Set();

  elements.forEach(el => {
    if (!isElementVisible(el)) return;

    const styles = window.getComputedStyle(el);
    const selector = getSimpleSelector(el);

    if (checkedSelectors.has(selector)) return;
    checkedSelectors.add(selector);

    // CSS Animations
    if (styles.animationName && styles.animationName !== 'none') {
      animations.cssAnimations.push({
        element: selector,
        name: styles.animationName,
        duration: styles.animationDuration,
        timing: styles.animationTimingFunction,
        iterationCount: styles.animationIterationCount,
        direction: styles.animationDirection
      });
    }

    // CSS Transitions
    if (styles.transitionProperty && styles.transitionProperty !== 'none' && styles.transitionProperty !== 'all') {
      animations.cssTransitions.push({
        element: selector,
        properties: styles.transitionProperty,
        duration: styles.transitionDuration,
        timing: styles.transitionTimingFunction
      });
    }

    // Check for scroll-triggered animations (Intersection Observer, AOS, etc.)
    const classes = el.className.toString();
    if (classes.match(/aos|scroll-?anim|fade-?in|slide-?in|animate-?on-?scroll/i)) {
      animations.scrollAnimations.push({
        element: selector,
        classes: classes.split(' ').filter(c =>
          c.match(/aos|scroll|fade|slide|animate/i)
        ).join(' ')
      });
    }

    // Detect common hover effects
    if (el.matches('a, button, .btn, [role="button"], .card, .product')) {
      const hasTransform = styles.transform && styles.transform !== 'none';
      const hasTransition = styles.transitionProperty && styles.transitionProperty !== 'none';

      if (hasTransition) {
        animations.hoverEffects.push({
          element: selector,
          type: 'transition',
          properties: styles.transitionProperty
        });
      }
    }
  });

  // Generate summary
  let summary = '';
  if (animations.cssAnimations.length > 0) {
    summary += `${animations.cssAnimations.length} CSS animations detected. `;
  }
  if (animations.scrollAnimations.length > 0) {
    summary += `${animations.scrollAnimations.length} scroll-triggered animations. `;
  }
  if (animations.hoverEffects.length > 0) {
    summary += `${animations.hoverEffects.length} interactive hover effects. `;
  }

  animations.summary = summary || 'Minimal animations detected';

  return {
    cssAnimations: animations.cssAnimations.slice(0, 10),
    cssTransitions: animations.cssTransitions.slice(0, 10),
    scrollAnimations: animations.scrollAnimations.slice(0, 10),
    hoverEffects: animations.hoverEffects.slice(0, 10),
    summary: animations.summary
  };
}

/**
 * Detect interactive elements
 */
function detectInteractiveElements() {
  const interactive = {
    carousels: [],
    modals: [],
    dropdowns: [],
    accordions: [],
    tabs: [],
    tooltips: [],
    videoPlayers: [],
    summary: ''
  };

  // Detect carousels/sliders
  const carousels = document.querySelectorAll(
    '[class*="carousel"], [class*="slider"], [class*="swiper"], .slick-slider, .owl-carousel'
  );
  carousels.forEach(carousel => {
    if (isElementVisible(carousel)) {
      const slides = carousel.querySelectorAll('[class*="slide"], [class*="item"]');
      interactive.carousels.push({
        slides: slides.length,
        autoplay: carousel.hasAttribute('data-autoplay') ||
                 carousel.classList.toString().includes('autoplay')
      });
    }
  });

  // Detect modals
  const modals = document.querySelectorAll(
    '[class*="modal"], [role="dialog"], [class*="popup"], [class*="lightbox"]'
  );
  interactive.modals.push({ count: modals.length });

  // Detect dropdowns
  const dropdowns = document.querySelectorAll(
    '[class*="dropdown"], [class*="menu"], [aria-haspopup="true"]'
  );
  interactive.dropdowns.push({ count: dropdowns.length });

  // Detect accordions
  const accordions = document.querySelectorAll(
    '[class*="accordion"], details, [role="region"][aria-labelledby]'
  );
  interactive.accordions.push({ count: accordions.length });

  // Detect tabs
  const tabs = document.querySelectorAll('[role="tablist"], [class*="tabs"]');
  interactive.tabs.push({ count: tabs.length });

  // Detect video players
  const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
  interactive.videoPlayers.push({ count: videos.length });

  // Generate summary
  let summary = '';
  if (interactive.carousels.length > 0) summary += `${interactive.carousels.length} carousel(s). `;
  if (interactive.modals[0].count > 0) summary += `${interactive.modals[0].count} modal(s). `;
  if (interactive.accordions[0].count > 0) summary += `${interactive.accordions[0].count} accordion(s). `;
  if (interactive.tabs[0].count > 0) summary += `${interactive.tabs[0].count} tab group(s). `;
  if (interactive.videoPlayers[0].count > 0) summary += `${interactive.videoPlayers[0].count} video(s). `;

  interactive.summary = summary || 'Basic interactive elements';

  return interactive;
}

/**
 * Get simple selector for an element
 */
function getSimpleSelector(el) {
  if (el.id) return `#${el.id}`;

  const classes = el.className.toString().split(' ')
    .filter(c => c && !c.match(/^(active|focus|hover|open)/))
    .slice(0, 2);

  if (classes.length > 0) {
    return `${el.tagName.toLowerCase()}.${classes.join('.')}`;
  }

  return el.tagName.toLowerCase();
}

/**
 * Extract links for multi-page crawling
 */
function extractNavigationLinks() {
  const navLinks = [];
  const seen = new Set();

  // Get links from navigation
  const navElements = document.querySelectorAll('nav, header, [role="navigation"]');

  navElements.forEach(nav => {
    const links = nav.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.href;
      const text = link.textContent.trim();

      if (!seen.has(href) && href && !href.includes('#') &&
          !href.includes('javascript:') && !href.includes('mailto:') &&
          href.startsWith(window.location.origin)) {
        seen.add(href);
        navLinks.push({
          url: href,
          text: text,
          importance: calculateLinkImportance(link, text)
        });
      }
    });
  });

  // Sort by importance
  navLinks.sort((a, b) => b.importance - a.importance);

  return navLinks.slice(0, 10); // Return top 10 most important nav links
}

/**
 * Calculate link importance for multi-page crawling
 */
function calculateLinkImportance(link, text) {
  let score = 0;

  // Prioritize certain keywords
  const highPriorityKeywords = ['about', 'services', 'products', 'contact', 'home', 'features'];
  const lowPriorityKeywords = ['privacy', 'terms', 'login', 'sign'];

  const lowerText = text.toLowerCase();

  if (highPriorityKeywords.some(k => lowerText.includes(k))) score += 10;
  if (lowPriorityKeywords.some(k => lowerText.includes(k))) score -= 5;

  // Prioritize nav links
  if (link.closest('nav, [role="navigation"]')) score += 5;

  // Prioritize header links
  if (link.closest('header')) score += 3;

  // Deprioritize footer links
  if (link.closest('footer')) score -= 3;

  // Shorter text is often more important
  if (text.length < 15) score += 2;

  return score;
}

/**
 * Clean and normalize text
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .substring(0, 10000); // Limit text length
}

/**
 * Message listener for commands from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    let result = null;

    switch (request.action) {
      case 'extractPage':
        result = getPageContent();
        break;
      case 'getNavigationLinks':
        result = extractNavigationLinks();
        break;
      case 'captureScreenshot':
        // Screenshot will be handled by background script
        result = { success: true };
        break;
      default:
        result = { error: 'Unknown action' };
    }

    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }

  return true; // Keep the message channel open for async response
});
