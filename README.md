# TikTok Original Video Downloader

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Last Updated](https://img.shields.io/badge/updated-2025--03--12-green)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)
![Chrome](https://img.shields.io/badge/platform-Chrome-yellow)

<img src="https://github.com/diepvantien/TikTok-Original-Video-Downloader/raw/main/icon.png" alt="Logo" width="128" height="128">

**Extract high-quality, watermark-free videos from TikTok profiles with ease**  
*Developed by [Diệp Văn Tiến](https://github.com/diepvantien)*

<a href="https://github.com/diepvantien/TikTok-Original-Video-Downloader/raw/main/TikTok%20Original%20Video%20Downloader.zip">
  <img src="https://img.shields.io/badge/DOWNLOAD-Extension%20v1.1.0-2ea44f?style=for-the-badge&logo=github" alt="Download Extension">
</a>

[Installation](#installation) • [Features](#key-features) • [Usage](#usage) • [FAQ](#frequently-asked-questions) • [Support](#support)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [Downloading with IDM](#downloading-with-idm)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Technical Details](#technical-details)
- [Support](#support)
- [License](#license)

---

## Overview

TikTok Original Video Downloader is a Chrome extension that lets you download videos from TikTok profiles in their original quality without watermarks. The extension automatically scans profile pages to find all videos and generates direct download links that can be used with any download manager.

---

## Key Features

✨ **Automatic Video Detection** - Intelligently finds all videos on a TikTok profile  
🎬 **Watermark-Free Downloads** - Provides links to original quality videos without TikTok's watermark  
📦 **Bulk Link Generation** - Creates download links for all videos on a profile at once  
🔄 **Auto-Scrolling** - Automatically scrolls through profiles to find all videos  
🔍 **Deep Scanning** - Uses multiple scan passes to ensure no videos are missed  
🛡️ **Duplicate Prevention** - Intelligently avoids duplicate videos during scanning  
🎯 **Clean User Interface** - Features a sleek, user-friendly interface with progress indicators  
💾 **Multiple Export Options** - Download as text file or copy to clipboard  
📝 **Detailed Instructions** - Includes proper download headers for optimal downloads

---

## Installation

### Method 1: Direct Download

<a href="https://github.com/diepvantien/TikTok-Original-Video-Downloader/raw/main/TikTok%20Original%20Video%20Downloader.zip">
  <img src="https://img.shields.io/badge/DOWNLOAD-Extension%20v1.1.0-2ea44f?style=for-the-badge&logo=github" alt="Download Extension">
</a>

1. Click the download button above to get the latest version
2. Extract the downloaded ZIP file to a location of your choice

### Method 2: Clone the Repository

```bash
git clone https://github.com/diepvantien/TikTok-Original-Video-Downloader.git
```

### Install in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** using the toggle in the top right
3. Click **Load unpacked**
4. Select the folder containing the extracted extension files
5. The extension is now installed and ready to use!

### Chrome Web Store

The extension will be available on the Chrome Web Store soon. Once approved, you can install it directly from there with a single click.

---

## Usage

### Finding and Extracting Video Links

1. **Navigate to a TikTok Profile**
   - Open any TikTok profile page (e.g., `https://www.tiktok.com/@username`)

2. **Activate the Extension**
   - Click the TikTok Original Video Downloader icon in your browser toolbar
   - A control panel will appear in the top right corner of the page

3. **Scanning Process**
   - The extension will automatically begin scrolling and scanning for videos
   - Monitor progress through the progress bar and status indicators
   - Wait until scanning is complete ("Found X videos! Ready to download")

4. **Export Video Links**
   - Click **Download Links (.txt)** to save all links as a text file
   - Or click **Copy All Links** to copy all links to your clipboard
   - The exported links include instructions and proper HTTP headers for downloading

---

## Downloading with IDM

Internet Download Manager (IDM) provides the best experience for downloading these videos. Here's how to set it up:

### Step 1: Import Links to IDM

**Method A: From Clipboard**
1. Copy the links (using the "Copy All Links" button in the extension)
2. Open IDM
3. Click **Tasks** > **Add Batch Download From Clipboard**

**Method B: From File**
1. Download the links as a text file (using the "Download Links (.txt)" button)
2. Open IDM
3. Click **Downloads** > **Import** > **Import list of URLs from file...**
4. Select the downloaded .txt file

### Step 2: Configure HTTP Headers

For optimal download quality, set these HTTP headers in IDM:

1. In the Batch download dialog, click the **Options** button
2. Select the **HTTP Headers** tab
3. Add the following headers:

```
User-Agent: TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet
Referer: https://www.tiktok.com/
```

4. Click **OK** to save

### Step 3: Start Downloading

1. Choose your download folder
2. Click **Start**
3. IDM will download all videos at maximum quality without watermarks

---

## Frequently Asked Questions

<details>
<summary><b>Why can't I install the extension?</b></summary>
<p>Make sure you've enabled Developer mode in Chrome's extension page. Also verify that the extracted folder contains all necessary files: manifest.json, background.js, content.js, and icon.png.</p>
</details>

<details>
<summary><b>The extension doesn't work on TikTok</b></summary>
<p>Ensure you're on a TikTok profile page (URL format: tiktok.com/@username). Try refreshing the page or reinstalling the extension if issues persist.</p>
</details>

<details>
<summary><b>My downloads fail or have watermarks</b></summary>
<p>Make sure you've properly configured the HTTP headers in your download manager. The extension provides direct links to original quality videos, but proper headers are needed for successful downloads.</p>
</details>

<details>
<summary><b>Is this extension legal?</b></summary>
<p>This extension is for personal use only. Please respect intellectual property rights and only download videos you have permission to use.</p>
</details>

<details>
<summary><b>Does it work on mobile?</b></summary>
<p>This extension is designed for desktop Chrome browsers. Mobile browsers generally don't support extensions.</p>
</details>

---

## Technical Details

### Browser Compatibility

- Google Chrome: Fully supported (v88+)
- Microsoft Edge: Compatible (Chromium-based versions)
- Opera: Compatible
- Firefox: Not currently supported
- Safari: Not currently supported

### Extension Components

- **content.js**: Handles the core functionality of finding and extracting video links
- **background.js**: Manages the extension's background processes and browser integration
- **manifest.json**: Defines the extension's properties and permissions

### Version History

| Version | Release Date | Changes |
|---------|-------------|---------|
| 1.1.0   | 2025-03-12  | Added donation info, improved scan algorithm |
| 1.0.5   | 2025-02-28  | Fixed compatibility issues with TikTok UI updates |
| 1.0.0   | 2025-02-15  | Initial release |

---

## Support

If you find this extension helpful, please consider supporting the developer:

- **Developer**: Diệp Văn Tiến (diepvantien)
- **Momo**: [Donate via Momo](https://me.momo.vn/OeIGiJsViJfDfntmiRId)
- **Vietinbank**: 109866849450
- **GitHub**: [https://github.com/diepvantien](https://github.com/diepvantien)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
<p>Last Updated: 2025-03-12 04:21:50 UTC</p>
<p>© 2025 Diệp Văn Tiến - All Rights Reserved</p>
</div>
