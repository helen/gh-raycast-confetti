// Track which PRs have already triggered confetti to avoid duplicates
const triggeredPRs = new Set();

// Get the current PR identifier
function getCurrentPRId() {
  const match = window.location.pathname.match(/\/([^\/]+\/[^\/]+)\/pull\/(\d+)/);
  return match ? `${match[1]}/pull/${match[2]}` : null;
}

// Check if CI checks have passed
function checkCIStatus() {
  const prId = getCurrentPRId();
  if (!prId) return;

  // If we've already triggered confetti for this PR, don't do it again
  if (triggeredPRs.has(prId)) return;

  // Look for the merge status section on GitHub
  // GitHub shows CI status in different ways, we'll check for common patterns
  
  // Method 1: Check for "All checks have passed" message
  const successMessages = document.querySelectorAll('.merge-message, .merge-status-item');
  for (const message of successMessages) {
    const text = message.textContent.trim();
    if (text.includes('All checks have passed') || 
        text.includes('checks passed') ||
        text.includes('successful checks')) {
      triggerConfetti(prId);
      return;
    }
  }

  // Method 2: Check the status checks section
  const statusSection = document.querySelector('.merge-status-list');
  if (statusSection) {
    // Look for success indicators
    const successIcon = statusSection.querySelector('[data-targets="animated-image.replacedImage"][alt="Success"]');
    const allChecksComplete = statusSection.querySelector('.completeness-indicator-success');
    
    if (successIcon || allChecksComplete) {
      // Make sure there are no failures
      const failureIcon = statusSection.querySelector('[data-targets="animated-image.replacedImage"][alt="Failure"]');
      if (!failureIcon) {
        triggerConfetti(prId);
        return;
      }
    }
  }

  // Method 3: Check for the branch status badge showing "success"
  const branchActionItem = document.querySelector('.branch-action-item');
  if (branchActionItem) {
    const statusIcon = branchActionItem.querySelector('.octicon-check, .color-fg-success');
    const statusText = branchActionItem.textContent;
    if (statusIcon && (statusText.includes('success') || statusText.includes('passed'))) {
      triggerConfetti(prId);
      return;
    }
  }

  // Method 4: Check the CI status summary at the bottom of the PR
  const mergeBox = document.querySelector('.merge-pr');
  if (mergeBox) {
    const stateClean = mergeBox.querySelector('.state-clean');
    if (stateClean) {
      const text = stateClean.textContent;
      if (text.includes('checks') && (text.includes('passed') || text.includes('successful'))) {
        triggerConfetti(prId);
        return;
      }
    }
  }
}

// Trigger Raycast confetti
function triggerConfetti(prId) {
  console.log('🎉 CI checks passed! Triggering Raycast confetti...');
  
  // Mark this PR as having triggered confetti
  triggeredPRs.add(prId);
  
  // Navigate to raycast://confetti
  window.location.href = 'raycast://confetti';
  
  console.log('Confetti triggered for PR:', prId);
  
  // Stop monitoring after confetti is triggered
  if (observer) {
    observer.disconnect();
  }
  if (pollInterval) {
    clearInterval(pollInterval);
  }
}

// Wait for the page to be ready before checking
function initializeExtension() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(checkCIStatus, 1000);
    });
  } else {
    // DOM is already ready
    setTimeout(checkCIStatus, 1000);
  }
}

// Initialize the extension
initializeExtension();

// Set up a MutationObserver to watch for changes in the DOM
// This will catch CI status updates that happen after page load
const observer = new MutationObserver((mutations) => {
  // Debounce the checks to avoid excessive calls
  clearTimeout(observer.checkTimeout);
  observer.checkTimeout = setTimeout(checkCIStatus, 500);
});

// Observe the main content area for changes
const targetNode = document.querySelector('#partial-discussion-header') || 
                   document.querySelector('.js-discussion') || 
                   document.body;

if (targetNode) {
  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-state']
  });
}

// Also check periodically in case mutations are missed
const pollInterval = setInterval(checkCIStatus, 10000); // Check every 10 seconds
