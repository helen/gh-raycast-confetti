# Testing Guide

## Manual Testing Steps

Since this is a Chrome extension that interacts with GitHub, manual testing is required:

### 1. Install the Extension

1. Open Chrome/Chromium
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select this repository folder

### 2. Test the Extension

#### Test Case 1: Fresh PR with Passing Checks
1. Open a GitHub PR that has passing CI checks
2. The extension should trigger Raycast confetti automatically
3. Check browser console for the message: "🎉 CI checks passed! Triggering Raycast confetti..."

#### Test Case 2: PR Where Checks Pass After Page Load
1. Open a GitHub PR where checks are still running
2. Wait for the checks to complete and pass
3. The extension should detect the change and trigger confetti
4. Verify confetti is only triggered once

#### Test Case 3: PR with Failing Checks
1. Open a GitHub PR with failing checks
2. Verify that confetti is NOT triggered
3. No console messages about triggering confetti should appear

#### Test Case 4: Multiple PRs
1. Open one PR with passing checks (confetti should trigger)
2. Open another PR with passing checks (confetti should trigger)
3. Return to the first PR (confetti should NOT trigger again)

### 3. Verify Permissions

In `chrome://extensions/`, click on the extension details and verify:
- ✅ Site access: "On specific sites"
- ✅ Listed site: `https://github.com/*/*`
- ✅ No unnecessary permissions requested

### 4. Console Debugging

Open the browser console on a GitHub PR page to see debug messages:
- Look for: "🎉 CI checks passed! Triggering Raycast confetti..."
- Look for: "Confetti triggered for PR: [owner/repo/pull/number]"

### Known Limitations

- Requires Raycast to be installed and running
- The browser must be allowed to open `raycast://` protocol links
- GitHub's UI can change, which may require updates to selectors
- Only works on GitHub PR pages (not issue pages)

### Troubleshooting

**If confetti doesn't trigger:**
1. Check if Raycast is installed and running
2. Verify the browser can open `raycast://` links
3. Check browser console for errors
4. Verify CI checks are actually passing
5. Try refreshing the page

**If the extension doesn't load:**
1. Check for syntax errors in the console
2. Verify all files are present
3. Check that manifest.json is valid JSON
4. Ensure you're using a Chromium-based browser
