# GitHub PR Raycast Confetti 🎉

A Chrome browser extension that automatically triggers Raycast confetti when your GitHub pull request passes CI checks!

## Features

- 🎊 Automatically detects when CI checks pass on GitHub PRs
- 🚀 Triggers Raycast confetti animation via `raycast://confetti`
- 📍 Works on any GitHub pull request page
- 🔄 Monitors for CI status changes in real-time
- 🎯 Only triggers once per PR to avoid spam

## Prerequisites

- Google Chrome or Chromium-based browser
- [Raycast](https://raycast.com/) installed on macOS

## Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/helen/gh-raycast-confetti.git
   cd gh-raycast-confetti
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked"
   - Select the `gh-raycast-confetti` directory

3. **Verify installation**
   - You should see "GitHub PR Raycast Confetti" in your extensions list
   - The extension icon should appear in your extensions toolbar

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
- Make sure all files are present (manifest.json, content.js, icons/)
- Check for errors in `chrome://extensions/`
- Verify you're using a Chromium-based browser

## Development

The extension consists of:
- `manifest.json` - Chrome extension configuration (Manifest V3)
- `content.js` - Content script that monitors GitHub PR pages
- `icons/` - Extension icons in multiple sizes

To modify the extension:
1. Make your changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a GitHub PR page

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
