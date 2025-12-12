# GitHub PR Raycast Confetti 🎉

A browser extension for Chrome and Firefox that automatically triggers Raycast confetti when your GitHub pull request passes CI checks!

## Features

- 🎊 Automatically detects when CI checks pass on GitHub PRs
- 🚀 Triggers Raycast confetti animation via `raycast://confetti`
- 📍 Works on any GitHub pull request page
- 🔄 Monitors for CI status changes in real-time
- 🎯 Only triggers once per PR to avoid spam
- 🦊 Available for both Chrome and Firefox

## Prerequisites

- Google Chrome/Chromium-based browser OR Mozilla Firefox
- [Raycast](https://raycast.com/) installed on macOS

## Installation

### For Chrome/Chromium

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/helen/gh-raycast-confetti.git
   cd gh-raycast-confetti
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked"
   - Select the `chrome` directory from this repository

3. **Verify installation**
   - You should see "GitHub PR Raycast Confetti" in your extensions list
   - The extension icon should appear in your extensions toolbar

### For Firefox

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/helen/gh-raycast-confetti.git
   cd gh-raycast-confetti
   ```

2. **Load the extension in Firefox**
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on..."
   - Navigate to the `firefox` directory and select the `manifest.json` file

3. **Verify installation**
   - You should see "GitHub PR Raycast Confetti" in the temporary extensions list
   - Note: Temporary extensions in Firefox are removed when you close the browser. For permanent installation, the extension would need to be signed and published to addons.mozilla.org

## Usage

1. Navigate to any GitHub pull request page (e.g., `https://github.com/owner/repo/pull/123`)
2. The extension will automatically monitor the CI check status
3. When all CI checks pass, Raycast confetti will be triggered automatically! 🎉

The extension checks for CI status:
- On initial page load
- When the DOM updates (e.g., when CI checks complete)
- Every 10 seconds as a fallback

## How It Works

The extension uses a content script that:
1. Monitors GitHub PR pages for CI check status updates
2. Detects various success indicators in the GitHub UI
3. Triggers the `raycast://confetti` URL when checks pass
4. Tracks which PRs have already triggered confetti to prevent duplicates

## Troubleshooting

**Confetti doesn't trigger:**
- Ensure Raycast is installed and running
- Check that the browser can open `raycast://` URLs (you may need to allow the protocol on first use)
- Verify that CI checks are actually passing on the PR
- Check the browser console for debug messages

**Extension not loading:**
- Make sure all files are present in the correct directory (`chrome/` or `firefox/`)
- Check for errors in `chrome://extensions/` (Chrome) or `about:debugging` (Firefox)
- Verify you're using a compatible browser (Chromium-based for Chrome version, Firefox for Firefox version)

## Development

The extension consists of:
- `chrome/` - Chrome extension files
  - `manifest.json` - Chrome extension configuration (Manifest V3)
  - `content.js` - Content script that monitors GitHub PR pages
  - `icons/` - Extension icons in multiple sizes
- `firefox/` - Firefox extension files
  - `manifest.json` - Firefox extension configuration (Manifest V3 with Firefox-specific settings)
  - `content.js` - Content script that monitors GitHub PR pages
  - `icons/` - Extension icons in multiple sizes

To modify the extension:

**For Chrome:**
1. Make your changes to the files in the `chrome/` directory
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a GitHub PR page

**For Firefox:**
1. Make your changes to the files in the `firefox/` directory
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Reload" next to the extension
4. Test on a GitHub PR page

**Note:** Both versions share the same `content.js` logic. If you make changes to the content script, make sure to update both `chrome/content.js` and `firefox/content.js`. You can use the following command to keep them in sync:

```bash
# After editing chrome/content.js, sync to Firefox:
cp chrome/content.js firefox/content.js

# Or after editing firefox/content.js, sync to Chrome:
cp firefox/content.js chrome/content.js
```

## Privacy

This extension:
- Only runs on GitHub PR pages (`https://github.com/*/*/pull/*`)
- Does not collect or transmit any data
- Does not require any API keys or authentication
- Only needs permission to access GitHub pages and open the Raycast URL

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- Built for use with [Raycast](https://raycast.com/)
- Inspired by the joy of passing CI checks! ✨
