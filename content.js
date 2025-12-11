// Track which PRs have already triggered confetti to avoid duplicates
// Uses PR ID + latest commit hash to allow re-triggering on new pushes
const triggeredPRs = new Set();

// Get the current PR identifier
function getCurrentPRId() {
  const match = window.location.pathname.match(/\/([^\/]+\/[^\/]+)\/pull\/(\d+)/);
  return match ? `${match[1]}/pull/${match[2]}` : null;
}

// Get the latest commit hash from the PR page
function getLatestCommitHash() {
  // GitHub displays the latest commit hash in several places
  // Try the timeline item for the latest commit
  const timelineItems = document.querySelectorAll('.TimelineItem');
  for (let i = timelineItems.length - 1; i >= 0; i--) {
    const item = timelineItems[i];
    const commitLink = item.querySelector('a.commit-id, a[href*="/commit/"]');
    if (commitLink) {
      const href = commitLink.getAttribute('href');
      const match = href?.match(/\/commit\/([a-f0-9]+)/);
      if (match) {
        return match[1].substring(0, 7); // Use short hash
      }
    }
  }
  
  // Fallback: Check for commit SHA in the branch info section
  const branchInfo = document.querySelector('.gh-header-meta');
  if (branchInfo) {
    const commitLink = branchInfo.querySelector('a[href*="/commit/"], .commit-ref');
    if (commitLink) {
      const href = commitLink.getAttribute('href');
      const match = href?.match(/\/commit\/([a-f0-9]+)/);
      if (match) {
        return match[1].substring(0, 7);
      }
    }
  }
  
  // Another fallback: Look for the latest commit in the commits list
  const commitId = document.querySelector('.commit-id');
  if (commitId) {
    const text = commitId.textContent.trim();
    if (text.length >= 7) {
      return text.substring(0, 7);
    }
  }
  
  return null;
}

// Get unique cache key for this PR + commit combination
function getCacheKey() {
  const prId = getCurrentPRId();
  const commitHash = getLatestCommitHash();
  
  // If we can get both PR ID and commit hash, use both
  // Otherwise, fall back to just PR ID (original behavior)
  if (prId && commitHash) {
    return `${prId}@${commitHash}`;
  }
  return prId;
}

// Check if CI checks have passed
function checkCIStatus() {
  const cacheKey = getCacheKey();
  if (!cacheKey) return;

  // If we've already triggered confetti for this PR+commit, don't do it again
  if (triggeredPRs.has(cacheKey)) return;

  // Look for the merge status section on GitHub
  // GitHub shows CI status in different ways, we'll check for common patterns
  
  // Method 1: Check for "All checks have passed" message
  const successMessages = document.querySelectorAll('.merge-message, .merge-status-item');
  for (const message of successMessages) {
    const text = message.textContent.trim();
    if (text.includes('All checks have passed') || 
        text.includes('checks passed') ||
        text.includes('successful checks')) {
      triggerConfetti(cacheKey);
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
        triggerConfetti(cacheKey);
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
      triggerConfetti(cacheKey);
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
        triggerConfetti(cacheKey);
        return;
      }
    }
  }
}

// Trigger Raycast confetti
function triggerConfetti(cacheKey) {
  console.log('🎉 CI checks passed! Triggering Raycast confetti...');
  
  // Mark this PR+commit as having triggered confetti
  triggeredPRs.add(cacheKey);
  
  // Navigate to raycast://confetti
  window.location.href = 'raycast://confetti';
  
  console.log('Confetti triggered for:', cacheKey);
  
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
