// Screenshot selector overlay
(function() {
  'use strict';

  // Create overlay for screenshot selection
  const overlay = document.createElement('div');
  overlay.id = 'wg-screenshot-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
    cursor: crosshair;
  `;

  const selectionBox = document.createElement('div');
  selectionBox.id = 'wg-selection-box';
  selectionBox.style.cssText = `
    position: fixed;
    border: 3px solid #5048C7;
    background: rgba(80, 72, 199, 0.1);
    display: none;
    z-index: 1000000;
    pointer-events: none;
  `;

  const instructions = document.createElement('div');
  instructions.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #5048C7;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 600;
    z-index: 1000001;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  `;
  instructions.textContent = 'Click and drag to select an area, or press ESC to cancel';

  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  document.body.appendChild(instructions);

  let startX, startY;
  let isSelecting = false;

  overlay.addEventListener('mousedown', (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;

    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
  });

  overlay.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  });

  overlay.addEventListener('mouseup', async (e) => {
    if (!isSelecting) return;

    isSelecting = false;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    // Minimum size check
    if (width < 50 || height < 50) {
      cleanup();
      alert('Selection too small. Please select a larger area.');
      return;
    }

    // Capture the selected area
    try {
      instructions.textContent = 'Capturing screenshot...';

      // Use Chrome's tab capture API
      const rect = {
        x: left,
        y: top,
        width: width,
        height: height
      };

      // Send message to background script to capture
      chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        rect: rect
      }, (response) => {
        cleanup();

        if (response && response.success) {
          // Screenshot captured successfully
          // The background script will handle opening the popup with the screenshot
        } else {
          alert('Failed to capture screenshot. Please try again.');
        }
      });

    } catch (error) {
      cleanup();
      console.error('Screenshot error:', error);
      alert('Error capturing screenshot: ' + error.message);
    }
  });

  // ESC to cancel
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      cleanup();
      document.removeEventListener('keydown', escHandler);
    }
  });

  function cleanup() {
    overlay.remove();
    selectionBox.remove();
    instructions.remove();
  }
})();
