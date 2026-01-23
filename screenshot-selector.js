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

  // Add dimension display
  const dimensionDisplay = document.createElement('div');
  dimensionDisplay.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    z-index: 1000002;
    display: none;
    pointer-events: none;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  document.body.appendChild(instructions);
  document.body.appendChild(dimensionDisplay);

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

    // Update dimension display
    dimensionDisplay.textContent = `${width} × ${height}px`;
    dimensionDisplay.style.display = 'block';
    dimensionDisplay.style.left = (currentX + 15) + 'px';
    dimensionDisplay.style.top = (currentY + 15) + 'px';
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

    // Minimum size check - allow very small selections (at least 10x10)
    if (width < 10 || height < 10) {
      cleanup();
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        font-weight: 600;
        z-index: 1000002;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      `;
      errorDiv.textContent = 'Selection too small (minimum 10×10px). Please select a larger area.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
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

      // Set a timeout for the response (15 seconds to allow for processing)
      let responseReceived = false;
      const timeoutId = setTimeout(() => {
        if (!responseReceived) {
          cleanup();
          // Show a temporary message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 1000002;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          `;
          errorDiv.innerHTML = 'Screenshot capture timed out.<br><small style="font-size: 14px; font-weight: 400;">The page may be loading slowly. Please reload the extension and try again.</small>';
          document.body.appendChild(errorDiv);
          setTimeout(() => errorDiv.remove(), 4000);
        }
      }, 15000);

      // Send message to background script to capture
      chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        rect: rect
      }, (response) => {
        responseReceived = true;
        clearTimeout(timeoutId);

        // Check for chrome.runtime.lastError
        if (chrome.runtime.lastError) {
          cleanup();
          console.error('Screenshot message error:', chrome.runtime.lastError);
          // Show error message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 1000002;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          `;
          errorDiv.textContent = 'Failed to capture screenshot: ' + chrome.runtime.lastError.message;
          document.body.appendChild(errorDiv);
          setTimeout(() => errorDiv.remove(), 3000);
          return;
        }

        cleanup();

        if (response && response.success) {
          // Screenshot captured successfully
          // Show success message
          const successDiv = document.createElement('div');
          successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #5048C7;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 1000002;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          `;
          successDiv.innerHTML = 'Screenshot captured!<br><small style="font-size: 14px; font-weight: 400;">Click the extension icon to continue</small>';
          document.body.appendChild(successDiv);
          setTimeout(() => successDiv.remove(), 3000);
        } else {
          const errorMsg = response?.error || 'Unknown error';
          // Show error message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 1000002;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          `;
          errorDiv.textContent = 'Failed to capture screenshot: ' + errorMsg;
          document.body.appendChild(errorDiv);
          setTimeout(() => errorDiv.remove(), 3000);
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
    dimensionDisplay.remove();
  }
})();
