# Usage Examples

This document provides detailed examples of how to use the Website Generator extension in various scenarios.

## Table of Contents

- [Example 1: Clone a Business Website](#example-1-clone-a-business-website)
- [Example 2: Convert Facebook Page to Website](#example-2-convert-facebook-page-to-website)
- [Example 3: Turn Spreadsheet Data into a Website](#example-3-turn-spreadsheet-data-into-a-website)
- [Example 4: Build from Design Mockup](#example-4-build-from-design-mockup)
- [Example 5: Extract Blog Content](#example-5-extract-blog-content)
- [Example 6: Create Website from Product Catalog](#example-6-create-website-from-product-catalog)

---

## Example 1: Clone a Business Website

**Scenario**: You want to create a website similar to a competitor or inspiration site.

### Steps:

1. Navigate to the website you want to clone (e.g., `https://example-agency.com`)
2. Click the Website Generator extension icon
3. Select **"Entire Page"**
4. Review the generated prompt (should include structure, sections, forms, etc.)
5. Optionally click **"Edit Prompt"** to customize
6. Click **"Generate Website with B12"**

### What Gets Extracted:

- Website title and meta description
- Header and navigation structure
- All main sections and their headings
- Forms and their fields
- Color scheme and fonts
- Layout structure (header, footer, sidebar)
- Main content text

### Example Generated Prompt:

```
Create a website similar to https://example-agency.com

Website name: Example Agency - Digital Marketing Experts

Description: Full-service digital marketing agency specializing in SEO, PPC, and social media marketing.

Website structure:

- Header with navigation
- Main navigation menu

Main sections:
1. Hero Section
2. Our Services
3. Case Studies
4. Client Testimonials
5. Contact Us

Content overview:
Example Agency is a leading digital marketing firm that helps businesses grow through data-driven strategies. We specialize in SEO, content marketing, paid advertising, and social media management...

Include 1 form with the following fields:
Form 1: name, email, phone, message, submit

Include approximately 12 images throughout the website

Color scheme: Use colors similar to rgb(102, 126, 234), rgb(118, 75, 162)
Typography: Use modern fonts similar to Inter, Arial

Additional requirements:
- Ensure the website is fully responsive and mobile-friendly
- Implement modern design patterns and best practices
- Include smooth transitions and interactions
- Optimize for fast loading and performance
- Make the design accessible and user-friendly
```

---

## Example 2: Convert Facebook Page to Website

**Scenario**: Turn a Facebook business page into a standalone website.

### Steps:

1. Navigate to a Facebook page (e.g., a local restaurant or business)
2. Scroll through the page to ensure content is loaded
3. Click the extension icon
4. Select **"Entire Page"** or **"Visible Content"** (for just what's on screen)
5. Click **"Generate Website with B12"**

### Tips:

- Use "Visible Content" if the Facebook page is very long
- The extension will extract the business name, description, and posts
- Images from posts will be included in the prompt

---

## Example 3: Turn Spreadsheet Data into a Website

**Scenario**: You have product data or pricing in a spreadsheet that you want to display on a website.

### Steps:

1. Open your spreadsheet (Google Sheets, Excel Online, etc.)
2. **Select the table data** you want to include (click and drag to highlight)
3. Click the extension icon
4. Select **"Selected Content"**
5. Review the prompt - it should include table structure
6. Click **"Generate Website with B12"**

### Example Generated Prompt:

```
Create a website with the following content:

The website should include the following data in a structured format:

Table 1:
Columns: Product Name, Price, Features, Availability
Rows: 5 rows of data
Sample data:
- Premium Plan | $99/month | Unlimited users, 24/7 support, API access | Available
- Business Plan | $49/month | Up to 50 users, Email support, Analytics | Available
- Starter Plan | $19/month | Up to 10 users, Basic features | Available

Design requirements:
- Make the design modern, clean, and professional
- Ensure the website is mobile-responsive
- Use appropriate typography and spacing
- Include clear calls-to-action where relevant
```

---

## Example 4: Build from Design Mockup

**Scenario**: You have a website design in Figma, Sketch, or as a screenshot that you want to convert to a real website.

### Steps:

1. Export your design as a PNG or JPG (full page screenshot)
2. Click the extension icon
3. Select **"Upload Mockup/Screenshot"**
4. Choose your design file
5. The extension generates a prompt describing how to recreate the design
6. Click **"Generate Website with B12"**

### Example Generated Prompt:

```
Create a website based on the provided mockup/screenshot.

Requirements:
- Replicate the layout and structure shown in the image
- Match the visual style, colors, and typography as closely as possible
- Ensure all sections, components, and elements from the mockup are included
- Make the website fully responsive and mobile-friendly
- Use modern web design best practices
- Implement any forms, buttons, or interactive elements shown
- Include placeholder content where text is not clearly visible
- Optimize images and assets for web performance

Note: This is based on a visual mockup/screenshot provided by the user.
```

---

## Example 5: Extract Blog Content

**Scenario**: You want to convert a blog post or article into a website.

### Steps:

1. Navigate to a blog post or article
2. **Select the main content** (headline, paragraphs, images)
   - Click at the start of the title
   - Drag to the end of the article
3. Click the extension icon
4. Select **"Selected Content"**
5. Edit the prompt to add context about the website purpose
6. Click **"Generate Website with B12"**

### Tips:

- You can select multiple sections by holding Ctrl/Cmd
- Include any images you want in the selection
- Edit the prompt to specify the website type (blog, portfolio, etc.)

---

## Example 6: Create Website from Product Catalog

**Scenario**: Convert an online product catalog or pricing page into your own website.

### Steps:

1. Navigate to a product catalog or pricing page
2. Select the products/pricing section you want
3. Click the extension icon
4. Select **"Selected Content"**
5. Review the extracted content
6. Edit the prompt to customize:
   ```
   Create an e-commerce website featuring these products:

   [Original extracted content]

   Additional requirements:
   - Add shopping cart functionality
   - Include product filtering by category
   - Add product search
   - Include customer reviews section
   ```
7. Click **"Generate Website with B12"**

---

## Tips for Better Results

### 1. Be Specific in Your Edits

After reviewing the generated prompt, add specific requirements:

```
Additional requirements:
- Use a dark theme with accent color #FF6B6B
- Include animated transitions
- Add a newsletter signup form
- Optimize for e-commerce with Stripe integration
- Include a blog section
```

### 2. Combine Multiple Extractions

You can extract content from multiple sources:

1. Extract text from one page
2. Copy the prompt
3. Extract a table from another page
4. Combine both prompts manually
5. Generate the website

### 3. Use Advanced Options Wisely

**For simple content sites:**
- ✅ Include styling information
- ✅ AI-enhance prompt
- ⬜ Include layout (if the layout isn't important)

**For complex page clones:**
- ✅ Include styling information
- ✅ Include images
- ✅ Describe layout structure
- ✅ AI-enhance prompt

**For mockup conversions:**
- ✅ Include styling information
- ✅ Include images
- ⬜ Describe layout structure (the image shows the layout)
- ✅ AI-enhance prompt

### 4. Right-Click for Quick Actions

For a faster workflow:

- **Right-click on selected text** → "Generate B12 website from selection"
- **Right-click on an image** → "Generate B12 website from image"
- **Right-click anywhere** → "Clone this page with B12"

This bypasses the popup and generates the website immediately.

### 5. Iterate and Refine

B12 makes it easy to refine:

1. Generate the first version
2. Review the result
3. Return to the extension
4. Extract more content or modify the prompt
5. Generate an updated version

---

## Common Patterns

### Pattern 1: Portfolio Website

1. Find portfolio examples you like
2. Extract individual project sections
3. Combine into one comprehensive prompt
4. Add your personal information
5. Generate with B12

### Pattern 2: Landing Page

1. Find high-converting landing pages
2. Extract visible content (hero, features, testimonials, CTA)
3. Edit to match your product/service
4. Generate with B12

### Pattern 3: Business Directory

1. Extract structured data from a directory site
2. Edit to include your listings
3. Add search and filtering requirements
4. Generate with B12

---

## Keyboard Shortcuts

While using the extension:

- **Ctrl/Cmd + C**: Copy generated prompt
- **Ctrl/Cmd + E**: Edit prompt (when in preview)
- **Enter**: Generate website (when preview is shown)
- **Esc**: Close popup

---

## Troubleshooting Examples

### "No content found"

**Solution**: Make sure you've selected content on the page before clicking "Selected Content"

### Prompt is too long

**Solution**:
1. Click "Edit Prompt"
2. Remove unnecessary details
3. Focus on key sections and requirements

### Missing important elements

**Solution**:
1. Click "Edit Prompt"
2. Add specific requirements:
   ```
   Also include:
   - Contact form with name, email, message fields
   - Social media icons in footer
   - Testimonials carousel
   ```

---

## Advanced Use Cases

### Multi-Page Website

Extract content from multiple pages and combine:

```
Create a website with the following pages:

Homepage:
[Extract from homepage]

About Us:
[Extract from about page]

Services:
[Extract from services page]

Contact:
Include a contact form with name, email, phone, and message fields
```

### Custom Functionality

Add custom requirements to the prompt:

```
[Extracted content]

Additional functionality required:
- User authentication (login/signup)
- Payment processing with Stripe
- Admin dashboard
- Email notifications
- Search functionality
- Multi-language support
```

---

Need more examples? Check the [README.md](README.md) or experiment with different content types!
