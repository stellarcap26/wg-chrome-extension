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
    images: extractImages(),
    links: extractLinks(),
    tables: extractTables(),
    forms: extractForms(),
    colors: extractColors(),
    fonts: extractFonts(),
    layout: analyzeLayout(),
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
      case 'extractSelected':
        result = getSelectedContent();
        break;
      case 'extractPage':
        result = getPageContent();
        break;
      case 'extractVisible':
        result = getVisibleContent();
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
