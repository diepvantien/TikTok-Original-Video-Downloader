/**
 * TikTok Original Quality Video Downloader
 * Version: 1.0.0
 * Date: 2025-03-12 04:28:47
 * Author: Diệp Văn Tiến
 * GitHub: https://github.com/diepvantien
 * 
 * This script extracts original quality no-watermark download links from TikTok profiles.
 * Features:
 * - Auto-scrolls to find all videos on a profile
 * - Generates direct download links for original quality videos
 * - Provides easy export options (text file or clipboard)
 * 
 * Support the developer:
 * - Momo: https://me.momo.vn/OeIGiJsViJfDfntmiRId
 * - Vietinbank: 109866849450
 */
(function() {
    // Extract profile username from URL first
    let profileUsername = location.pathname.split('/')[1];
    if (profileUsername && profileUsername.startsWith('@')) {
        profileUsername = profileUsername.substring(1);
    } else {
        profileUsername = 'tiktok';
    }
    
    // Create UI container
    const container = document.createElement('div');
    container.id = 'tiktok-original-downloader';
    container.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        width: 350px;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 9999999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;
    
    // Add UI content
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; font-size: 16px;">TikTok Original Video Downloader</h3>
            <div style="font-size: 12px; padding: 2px 6px; background: #2d3748; border-radius: 4px; color: #63b3ed;">
                Auto-Scroll
            </div>
        </div>
        
        <div style="margin-bottom: 10px; padding: 5px; border-radius: 4px; background: #2d3748; font-size: 12px;">
            <div>User: <span id="current-user" style="color: #4ade80;">diepvantien</span></div>
            <div>Time: <span id="current-time" style="color: #4ade80;">2025-03-12 04:28:47</span></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <div id="status-message" style="font-size: 13px;">Auto-scrolling in progress...</div>
            <div id="capture-ratio" style="color: #48bb78; font-size: 13px;">Links: 0/0</div>
        </div>
        
        <div style="background: #2d3748; height: 6px; border-radius: 3px; margin: 8px 0;">
            <div id="progress-bar" style="background: #48bb78; height: 6px; width: 0%; border-radius: 3px; transition: width 0.3s;"></div>
        </div>
        
        <div id="url-container" style="max-height: 200px; overflow-y: auto; background: #1a202c; border-radius: 6px; padding: 8px; margin: 8px 0; font-family: monospace; font-size: 11px;">
            <div style="color: #a0aec0; text-align: center;">Auto-scrolling to find videos...</div>
        </div>
        
        <div id="action-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
            <button id="download-links" style="padding: 8px; background: #2563eb; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Download Links (.txt)
            </button>
            <button id="copy-links" style="padding: 8px; background: #8b5cf6; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Copy All Links
            </button>
            <button id="stop-scroll" style="padding: 8px; background: #d69e2e; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Stop Auto-Scroll
            </button>
            <button id="close-button" style="padding: 8px; background: #e53e3e; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        </div>
        
        <div style="margin-top: 10px; padding: 8px; background: #1a202c; border-radius: 6px; font-size: 11px; color: #a0aec0;">
            <div style="margin-bottom: 5px; color: #a0aec0;">Author: Diệp Văn Tiến</div>
            <div style="margin-bottom: 3px;">
                <span>Momo:</span> 
                <a href="https://me.momo.vn/OeIGiJsViJfDfntmiRId" target="_blank" style="color: #63b3ed; text-decoration: none;">Donate via Momo</a>
            </div>
            <div style="color: #a0aec0;">Vietinbank: 109866849450</div>
        </div>
        
        <div style="margin-top: 8px; font-size: 11px; color: #a0aec0; line-height: 1.4;">
            <span id="completion-status">Auto-scrolling to find videos (0%)...</span>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Get references to UI elements
    const statusMessage = document.getElementById('status-message');
    const captureRatio = document.getElementById('capture-ratio');
    const urlContainer = document.getElementById('url-container');
    const progressBar = document.getElementById('progress-bar');
    const completionStatus = document.getElementById('completion-status');
    const downloadLinksBtn = document.getElementById('download-links');
    const copyLinksBtn = document.getElementById('copy-links');
    const stopScrollButton = document.getElementById('stop-scroll');
    const closeButton = document.getElementById('close-button');
    
    // State tracking variables
    let videoCollection = [];  // Stores all found videos
    let videoElements = [];    // Stores video elements on page
    let totalVideos = 0;       // Total videos found
    let isScrolling = true;    // Auto-scroll state (starts true by default)
    let scrollInterval = null; // Interval handle
    let isComplete = false;    // Whether extraction is complete
    let seenVideoIds = new Set(); // Track seen video IDs to prevent duplicates
    
    // Auto-scroll configuration
    const scrollConfig = {
        scrollInterval: 3500,  // Time between scrolls
        scrollAmount: 800,     // Amount to scroll each time
        noNewVideoLimit: 5,    // Stop after this many scrolls without new videos
        scrollsWithNoNewVideos: 0
    };
    
    // Extract video ID from URL
    function extractVideoId(url) {
        try {
            const match = url.match(/\/video\/(\d+)/);
            return match && match[1] ? match[1] : '';
        } catch (e) {
            return '';
        }
    }
    
    // Get original download URL for video ID
    function getOriginalDownloadUrl(videoId) {
        // This format works with direct downloading if proper headers are set
        return `https://tikwm.com/video/media/hdplay/${videoId}.mp4`;
    }
    
    // Find all videos on the page
    function findVideoElements() {
        // Two methods for finding videos (for better compatibility)
        // Method 1: Find data-e2e elements (works on most layouts)
        let elements1 = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"]'));
        
        // Method 2: Find all links that go to videos
        let elements2 = Array.from(document.querySelectorAll('a[href*="/video/"]'))
            .filter(a => a.href.includes('/video/') && 
                         !a.href.includes('/tag/') && 
                         !a.href.includes('/music/'));
        
        const oldCount = totalVideos;
        // Use the method that found more videos
        videoElements = elements1.length >= elements2.length ? elements1 : elements2;
        totalVideos = videoElements.length;
        
        // Process each video element
        videoElements.forEach(element => {
            try {
                // If element is a div, find the link inside it
                const link = element.tagName.toLowerCase() === 'a' ? element : element.querySelector('a');
                
                if (link && link.href && link.href.includes('/video/')) {
                    const videoId = extractVideoId(link.href);
                    
                    // Only add new video IDs
                    if (videoId && !seenVideoIds.has(videoId)) {
                        seenVideoIds.add(videoId);
                        
                        // Add new video to collection
                        videoCollection.push({
                            id: videoId,
                            pageUrl: link.href,
                            originalUrl: getOriginalDownloadUrl(videoId)
                        });
                    }
                }
            } catch (e) {
                console.error('Error processing video element:', e);
            }
        });
        
        // Update UI if count changed
        if (oldCount !== totalVideos || videoCollection.length !== oldCount) {
            updateUI();
            console.log(`Found ${totalVideos} videos, collected ${videoCollection.length} URLs`);
            return true; // Videos were found
        }
        
        return false; // No new videos
    }
    
    // Update UI elements
    function updateUI() {
        // Update counter
        captureRatio.textContent = `Links: ${videoCollection.length}/${totalVideos}`;
        
        // Update progress bar
        const percentage = totalVideos > 0 ? Math.min(100, Math.round((videoCollection.length / totalVideos) * 100)) : 0;
        progressBar.style.width = `${percentage}%`;
        
        // Update status text
        if (isScrolling) {
            completionStatus.textContent = `Auto-scrolling to find videos (${percentage}% captured)`;
        } else {
            completionStatus.textContent = `Found ${videoCollection.length} of ${totalVideos} videos`;
        }
        
        // Update completion status
        if (videoCollection.length >= totalVideos && !isComplete && totalVideos > 0) {
            progressBar.style.background = '#48bb78'; // Green
            statusMessage.textContent = 'All videos found! Ready to download.';
            isComplete = true;
            
            if (isScrolling) {
                stopAutoScroll();
            }
        }
        
        // Update URL list display
        if (videoCollection.length === 0) {
            urlContainer.innerHTML = `<div style="color: #a0aec0; text-align: center;">No videos found yet...</div>`;
            return;
        }
        
        // Display first 10 videos
        const displayVideos = videoCollection.slice(0, 10);
        
        urlContainer.innerHTML = displayVideos.map((video, index) => `
            <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #2d3748;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #48bb78;">Video ${index + 1}</span>
                    <span style="color: #a0aec0; font-size: 10px;">${video.id}</span>
                </div>
                <div style="word-break: break-all; color: #e2e8f0; margin-top: 4px; font-size: 10px;">
                    ${video.originalUrl.substring(0, 45)}...
                </div>
            </div>
        `).join('');
        
        if (videoCollection.length > 10) {
            urlContainer.innerHTML += `<div style="color: #a0aec0; text-align: center;">+ ${videoCollection.length - 10} more videos</div>`;
        }
    }
    
    // Auto-scroll implementation
    function startAutoScroll() {
        if (scrollInterval) return; // Already scrolling
        
        isScrolling = true;
        scrollConfig.scrollsWithNoNewVideos = 0;
        stopScrollButton.textContent = 'Stop Auto-Scroll';
        stopScrollButton.style.background = '#d69e2e';
        
        // First find video elements
        findVideoElements();
        
        // Start scroll interval
        scrollInterval = setInterval(() => {
            // Scroll down
            window.scrollBy(0, scrollConfig.scrollAmount);
            
            // Check if we've reached the bottom
            const scrolledToBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100;
            
            // Check if new videos appeared
            const foundNewVideos = findVideoElements();
            
            if (!foundNewVideos) {
                scrollConfig.scrollsWithNoNewVideos++;
                completionStatus.textContent = `Scrolling... No new videos for ${scrollConfig.scrollsWithNoNewVideos} scrolls`;
                
                // Try scrolling to bottom after a few unsuccessful attempts
                if (scrollConfig.scrollsWithNoNewVideos === 3) {
                    window.scrollTo(0, document.body.scrollHeight);
                } 
                
                // Stop if we've tried enough times or reached the bottom
                if (scrollConfig.scrollsWithNoNewVideos >= scrollConfig.noNewVideoLimit || scrolledToBottom) {
                    stopAutoScroll();
                }
            } else {
                // Reset counter since we found new videos
                scrollConfig.scrollsWithNoNewVideos = 0;
            }
        }, scrollConfig.scrollInterval);
        
        console.log(`Started auto-scrolling to find videos`);
    }
    
    // Stop auto-scroll
    function stopAutoScroll() {
        if (!isScrolling) return;
        
        clearInterval(scrollInterval);
        scrollInterval = null;
        isScrolling = false;
        
        stopScrollButton.textContent = 'Resume Auto-Scroll';
        stopScrollButton.style.background = '#6366f1';
        
        statusMessage.textContent = `Found ${totalVideos} videos, captured ${videoCollection.length} URLs`;
        
        console.log(`Auto-scroll stopped`);
    }
    
    // Create download information text
    function createDownloadText() {
        let text = '';
        
        // Add header with instructions
        text += `# TikTok Original Video Download Links for @${profileUsername}\n`;
        text += `# Generated on: 2025-03-12 04:28:47\n`;
        text += `# Created by: Diệp Văn Tiến\n`;
        text += `# Number of videos: ${videoCollection.length}\n\n`;
        text += `# INSTRUCTIONS FOR DOWNLOADING:\n`;
        text += `# 1. Import these links into a download manager (IDM, aria2c, etc.)\n`;
        text += `# 2. Make sure to use these HTTP headers when downloading:\n`;
        text += `#    User-Agent: TikTok 26.2.0 rv