# Testing Checklist

Use this checklist to verify the Website Generator extension is working correctly.

## Pre-Installation Checks

- [ ] All required files are present:
  - [ ] manifest.json
  - [ ] popup.html
  - [ ] popup.js
  - [ ] content.js
  - [ ] background.js
  - [ ] styles.css
  - [ ] icons/icon16.png
  - [ ] icons/icon48.png
  - [ ] icons/icon128.png

- [ ] manifest.json is valid JSON (no syntax errors)
- [ ] All JavaScript files have no syntax errors

## Installation Tests

- [ ] Extension loads without errors in Chrome
- [ ] Extension icon appears in the toolbar
- [ ] No error messages on chrome://extensions/ page
- [ ] Correct extension name and description displayed

## Popup UI Tests

- [ ] Extension popup opens when clicking the icon
- [ ] All four main buttons are visible:
  - [ ] "Selected Content"
  - [ ] "Entire Page"
  - [ ] "Visible Content"
  - [ ] "Upload Mockup/Screenshot"
- [ ] Advanced options expand/collapse correctly
- [ ] All checkboxes in advanced options are functional
- [ ] UI styling looks correct (no broken CSS)

## Content Extraction Tests

### Test 1: Selected Content Extraction

1. [ ] Open any webpage with text content
2. [ ] Select some text on the page
3. [ ] Click extension icon → "Selected Content"
4. [ ] Verify prompt preview appears
5. [ ] Check that selected text is in the prompt
6. [ ] Test with:
   - [ ] Plain text selection
   - [ ] Text with images
   - [ ] Table data
   - [ ] Text with links

### Test 2: Entire Page Extraction

1. [ ] Open a complex webpage (e.g., news site, business site)
2. [ ] Click extension icon → "Entire Page"
3. [ ] Verify prompt preview appears with:
   - [ ] Page title
   - [ ] URL
   - [ ] Main headings
   - [ ] Content structure
   - [ ] Forms (if present)
4. [ ] Test on different types of pages:
   - [ ] Blog post
   - [ ] Product page
   - [ ] Landing page
   - [ ] Social media page

### Test 3: Visible Content Extraction

1. [ ] Open any webpage
2. [ ] Scroll to a specific section
3. [ ] Click extension icon → "Visible Content"
4. [ ] Verify only visible content is extracted
5. [ ] Check that content below fold is not included

### Test 4: Image Upload

1. [ ] Click extension icon → "Upload Mockup/Screenshot"
2. [ ] Select an image file
3. [ ] Verify prompt preview appears with mockup instructions
4. [ ] Test with different image formats:
   - [ ] PNG
   - [ ] JPG
   - [ ] JPEG

## Prompt Generation Tests

- [ ] Generated prompts are coherent and detailed
- [ ] Prompts include all requested elements
- [ ] Special characters are handled correctly
- [ ] Long content is appropriately truncated
- [ ] Table data is formatted clearly
- [ ] Image descriptions are included

## Advanced Options Tests

### With "Include styling information" enabled:
- [ ] Color scheme is extracted and included
- [ ] Font information is included

### With "Include images" enabled:
- [ ] Image count and descriptions are in prompt

### With "Include layout structure" enabled:
- [ ] Header/footer presence is noted
- [ ] Section structure is described

### With "AI-enhance prompt" enabled:
- [ ] Additional design requirements are added
- [ ] Best practices are mentioned

## Edit Functionality Tests

- [ ] "Edit Prompt" button opens edit mode
- [ ] Prompt text is editable in textarea
- [ ] "Save & Generate" saves changes
- [ ] "Cancel" reverts to preview mode
- [ ] Edited prompt is used for generation

## Copy Functionality Tests

- [ ] "Copy Prompt" button works
- [ ] Success message appears
- [ ] Clipboard contains the correct prompt text
- [ ] Test on different browsers

## B12 URL Generation Tests

- [ ] "Generate Website with B12" button works
- [ ] New tab opens with B12 URL
- [ ] URL is properly formatted:
  - [ ] Starts with https://b12.io/signup/
  - [ ] Contains ?business_description= parameter
  - [ ] Prompt is properly URL-encoded
- [ ] Special characters in prompt are encoded correctly:
  - [ ] Spaces → %20
  - [ ] Ampersands → %26
  - [ ] Quotes → %22
  - [ ] Line breaks are handled

## Context Menu Tests (Right-Click)

- [ ] Right-click on selected text shows menu option
- [ ] "Generate B12 website from selection" works
- [ ] Right-click on image shows menu option
- [ ] "Generate B12 website from image" works
- [ ] Right-click on page shows menu option
- [ ] "Clone this page with B12" works
- [ ] All context menu actions open B12 correctly

## Storage Tests

- [ ] Advanced options preferences are saved
- [ ] Preferences persist after closing/reopening extension
- [ ] Preferences persist after browser restart

## Error Handling Tests

### No Content Selected:
- [ ] "Selected Content" with no selection shows error message
- [ ] Error message is clear and helpful

### Content Script Injection:
- [ ] Extension works on regular web pages
- [ ] Appropriate error on restricted pages (chrome://, chrome-extension://)

### Network Issues:
- [ ] Extension handles offline state gracefully
- [ ] B12 URL generation works without network

### Invalid Input:
- [ ] Non-image file upload shows error
- [ ] Empty prompt shows appropriate message

## Performance Tests

- [ ] Extension popup opens quickly (< 1 second)
- [ ] Content extraction completes in reasonable time (< 3 seconds)
- [ ] Prompt generation is fast (< 1 second)
- [ ] No memory leaks after repeated use
- [ ] Works well on pages with:
  - [ ] Large amounts of content
  - [ ] Many images
  - [ ] Complex tables
  - [ ] Heavy JavaScript

## Cross-Page Tests

Test on various page types:

- [ ] **News sites**: CNN, BBC, New York Times
- [ ] **E-commerce**: Amazon product pages
- [ ] **Social media**: Facebook, LinkedIn pages
- [ ] **Documentation**: GitHub, MDN
- [ ] **Blogs**: Medium, WordPress sites
- [ ] **Single-page apps**: Gmail, Google Drive
- [ ] **Forms**: Google Forms, Typeform
- [ ] **Spreadsheets**: Google Sheets, Excel Online

## Browser Compatibility

- [ ] Google Chrome (latest)
- [ ] Microsoft Edge (Chromium)
- [ ] Brave Browser
- [ ] Opera
- [ ] Vivaldi

## Security Tests

- [ ] Extension only requests necessary permissions
- [ ] No data is sent anywhere except B12 (when user chooses)
- [ ] Content script doesn't modify page content
- [ ] No external scripts are loaded
- [ ] No tracking or analytics

## Accessibility Tests

- [ ] Popup is keyboard navigable
- [ ] All buttons have proper focus states
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatible (test with screen reader if available)

## Documentation Tests

- [ ] README.md is clear and comprehensive
- [ ] INSTALLATION.md instructions work
- [ ] EXAMPLES.md examples are realistic
- [ ] All links in documentation work
- [ ] Screenshots/images (if any) are visible

## Regression Tests (After Updates)

After making any changes, re-run:

- [ ] All content extraction tests
- [ ] B12 URL generation
- [ ] UI functionality
- [ ] Context menu integration

## Known Issues

Document any issues found during testing:

1.
2.
3.

## Notes

Add any additional notes or observations:

---

**Testing completed by:** _______________

**Date:** _______________

**Chrome version:** _______________

**Extension version:** 1.0.0

**Result:** ☐ Pass ☐ Fail ☐ Partial
