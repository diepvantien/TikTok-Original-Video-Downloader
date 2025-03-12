TikTok Original Video Downloader - User Guide
Version: 1.1.0
Updated: 2025-03-12 04:06:31
Developer: Diệp Văn Tiến (diepvantien)
GitHub Repository: https://github.com/diepvantien/TikTok-Original-Video-Downloader

1. Downloading the Extension from GitHub
Visit the GitHub repository: https://github.com/diepvantien/TikTok-Original-Video-Downloader
Click the green Code button in the top right corner
Select Download ZIP from the dropdown menu
The ZIP file will be downloaded to your computer (typically to your Downloads folder)
2. Extraction and Installation
Extract the ZIP file:

Right-click on the downloaded ZIP file
Select "Extract All..." (Windows) or open with your extraction utility (Mac/Linux)
Choose a location for the extracted files and click "Extract"
Install the extension in Chrome:

Open Chrome browser
Enter chrome://extensions/ in the address bar and press Enter
Enable Developer mode in the top right corner
Click the Load unpacked button
Select the folder containing the extracted extension files
The extension will appear in your list of installed extensions with its icon
3. Using the Extension to Extract TikTok Videos
Navigate to a TikTok profile:

Open any TikTok profile page you want to download videos from (e.g., https://www.tiktok.com/@username)
Activate the extension:

Click on the TikTok Original Video Downloader icon in your browser toolbar
A small window will appear in the top right corner of the page
Video scanning process:

The extension will automatically scroll through the page and scan for all videos
Monitor the scanning progress through the progress bar and status messages
Wait until the scanning process is complete (you'll see "Found X videos! Ready to download.")
Download the video links:

After scanning is complete, click the Download Links (.txt) button
A text file containing all the links will be downloaded to your computer
Alternatively, you can click Copy All Links to copy all links to your clipboard
4. Setting Up Internet Download Manager (IDM) for Downloading
Install IDM (if you don't have it yet):

Download and install IDM from the official website: internetdownloadmanager.com
Import the links into IDM:

Method 1: Using Batch Download from Clipboard

Open IDM
Click Tasks > Add Batch Download From Clipboard (or press Ctrl+V)
IDM will automatically detect the links from the .txt file
Method 2: Using Import Feature

Open IDM
Click Downloads > Import > Import list of URLs from file...
Select the downloaded .txt file from the previous step
Set up HTTP headers in IDM:

In the "Batch download" window, click the Options button
Select the HTTP Headers tab
Add the following headers:
Code
User-Agent: TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet
Referer: https://www.tiktok.com/
Click OK to save the settings
Start downloading:

Choose the folder to save your videos
Click Start to begin downloading
IDM will automatically download all videos in the highest quality without watermarks
5. Troubleshooting Common Issues
Unable to install the extension:

Make sure you have enabled "Developer mode" on the extensions page
Check that the extracted folder contains all necessary files (manifest.json, background.js, content.js, icon.png)
Extension doesn't work on TikTok:

Ensure you are on a TikTok profile page (format: tiktok.com/@username)
Refresh the page and try again
Disable and re-enable the extension in the extensions page
IDM fails to download videos:

Make sure you've set up the HTTP headers correctly
Check if the links in the .txt file are valid
Try manually downloading a single link to test
Downloaded videos have errors or watermarks:

Ensure you've set up the correct HTTP headers in IDM
Check if you're using the latest version of the extension
6. Support the Developer
If you find this extension useful, please consider supporting the developer:

Momo: https://me.momo.vn/OeIGiJsViJfDfntmiRId
Vietinbank: 109866849450
Important Note: This extension is for personal use only. Please respect intellectual property rights and only download videos you have the right to use.
