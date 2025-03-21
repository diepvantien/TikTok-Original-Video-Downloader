/**
 * TikTok Original Quality Video Downloader
 * Date: 2025-03-21 21:36:13
 * User: diepvantien
 * 
 * This script extracts original quality no-watermark download links
 * - Auto-scrolls automatically to find all videos
 * - Generates direct download links for original quality
 * - NEW: Direct download all videos at once
 * - NEW: Extract link for currently playing video
 * - NEW: Support for liked videos tab
 * 
 * Donate to the developer:
 * - Momo: https://me.momo.vn/OeIGiJsViJfDfntmiRId
 * - Vietinbank: 109866849450
 */
(function() {
    let profileUsername = location.pathname.split('/')[1];
    if (profileUsername && profileUsername.startsWith('@')) {
        profileUsername = profileUsername.substring(1);
    } else {
        profileUsername = 'tiktok';
    }
    
    // Determine if we're on the "liked" tab
    const isLikedTab = location.pathname.includes('/liked');
    
    // Main container
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
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; font-size: 16px;">TikTok Original Video Downloader</h3>
            <div style="font-size: 12px; padding: 2px 6px; background: #2d3748; border-radius: 4px; color: #63b3ed;">
                Auto-Scroll
            </div>
        </div>
        
        <div style="margin-bottom: 10px; padding: 5px; border-radius: 4px; background: #2d3748; font-size: 12px;">
            <div>User: <span id="current-user" style="color: #4ade80;">${profileUsername}</span></div>
            <div>Mode: <span id="current-mode" style="color: #4ade80;">${isLikedTab ? 'Liked Videos' : 'Profile Videos'}</span></div>
            <div>Time: <span id="current-time" style="color: #4ade80;">2025-03-21 21:36:13</span></div>
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
        
        <div id="action-buttons" style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px;">
            <button id="download-all-videos" style="padding: 8px; background: #9333ea; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Download All Videos
            </button>
            <button id="download-links" style="padding: 8px; background: #2563eb; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Download Links (.txt)
            </button>
            <button id="current-video" style="padding: 8px; background: #10b981; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Get Currently Playing Video
            </button>
            <button id="stop-scroll" style="padding: 8px; background: #d69e2e; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Stop Auto-Scroll
            </button>
            <button id="close-button" style="padding: 8px; background: #e53e3e; border: none; color: white; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        </div>
        
        <div style="margin-top: 10px; padding: 8px; background: #1a202c; border-radius: 6px; font-size: 11px; color: #a0aec0;">
            <div style="margin-bottom: 5px; color: #a0aec0;">
                Author: <a href="https://github.com/diepvantien" target="_blank" style="color: #63b3ed; text-decoration: none;">diepvantien</a>
            </div>
            <div style="margin-bottom: 5px;">
                Donate: 
                <a href="https://me.momo.vn/OeIGiJsViJfDfntmiRId" target="_blank" style="color: #63b3ed; text-decoration: none;">Momo</a> | 
                <a href="#" id="show-vietqr" style="color: #63b3ed; text-decoration: none;">Vietinbank</a>
            </div>
        </div>
        
        <div id="download-progress" style="display: none; margin-top: 8px; font-size: 11px; color: #a0aec0; line-height: 1.4;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Downloading videos...</span>
                <span id="download-count">0/0</span>
            </div>
            <div style="background: #2d3748; height: 4px; border-radius: 2px;">
                <div id="download-progress-bar" style="background: #9333ea; height: 4px; width: 0%; border-radius: 2px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Setup VietQR function
    document.getElementById('show-vietqr').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Thông tin tài khoản Vietinbank
        const accountNumber = '109866849450';
        const accountName = 'DIEP VAN TIEN';
        const bankCode = 'ICB'; // Mã ngân hàng Vietinbank
        const message = 'Ung ho Diep Van Tien'; // Nội dung chuyển khoản
        
        // Tạo URL VietQR
        const vietQrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=0&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(accountName)}`;
        
        // Mở cửa sổ mới với hình ảnh VietQR
        window.open(vietQrUrl, '_blank');
    });
    
    const statusMessage = document.getElementById('status-message');
    const captureRatio = document.getElementById('capture-ratio');
    const urlContainer = document.getElementById('url-container');
    const progressBar = document.getElementById('progress-bar');
    const completionStatus = document.getElementById('completion-status');
    const downloadLinksBtn = document.getElementById('download-links');
    const downloadAllVideosBtn = document.getElementById('download-all-videos');
    const currentVideoBtn = document.getElementById('current-video');
    const stopScrollButton = document.getElementById('stop-scroll');
    const closeButton = document.getElementById('close-button');
    const downloadProgress = document.getElementById('download-progress');
    const downloadCount = document.getElementById('download-count');
    const downloadProgressBar = document.getElementById('download-progress-bar');
    
    let videoCollection = [];
    let videoElements = [];
    let totalVideos = 0;
    let isScrolling = true;
    let scrollInterval = null;
    let isComplete = false;
    let isDownloading = false;
    let currentDownloadIndex = 0;
    
    const scrollConfig = {
        scrollInterval: 3500,
        scrollAmount: 800,
        noNewVideoLimit: 5,
        scrollsWithNoNewVideos: 0
    };
    
    function extractVideoId(url) {
        try {
            const match = url.match(/\/video\/(\d+)/);
            return match && match[1] ? match[1] : '';
        } catch (e) {
            return '';
        }
    }
    
    function getOriginalDownloadUrl(videoId) {
        return `https://tikwm.com/video/media/hdplay/${videoId}.mp4`;
    }
    
    // Function to extract currently playing video
    function getCurrentlyPlayingVideo() {
        try {
            // For single video view page
            if (location.pathname.includes('/video/')) {
                const videoId = extractVideoId(location.href);
                if (videoId) {
                    return {
                        id: videoId,
                        pageUrl: location.href,
                        originalUrl: getOriginalDownloadUrl(videoId)
                    };
                }
            }
            
            // For FYP or profile/liked feed - find the video in viewport
            // There are different selectors depending on TikTok's current design
            const possibleSelectors = [
                // Main feed videos
                'div[data-e2e="feed-video"][class*="DivItemContainer"]:not([style*="display: none"])',
                // Profile videos currently in view
                'div[data-e2e="user-post-item"]:not([style*="display: none"])',
                // Liked videos in view (based on your HTML)
                'div[data-e2e="user-liked-item"]:not([style*="display: none"])',
                // General video container
                'div[class*="DivItemContainer"]:not([style*="display: none"])',
                // Video player container
                'div[data-e2e="video-player"]:not([style*="display: none"])'
            ];
            
            let currentVideo = null;
            
            // Try each selector until we find a match
            for (const selector of possibleSelectors) {
                const elements = document.querySelectorAll(selector);
                
                for (const element of elements) {
                    // Check if element is in viewport
                    const rect = element.getBoundingClientRect();
                    const isVisible = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                    
                    if (isVisible) {
                        // Find the link element within this container
                        const link = element.querySelector('a[href*="/video/"]') || 
                                     element.closest('a[href*="/video/"]');
                        
                        if (link && link.href) {
                            const videoId = extractVideoId(link.href);
                            if (videoId) {
                                currentVideo = {
                                    id: videoId,
                                    pageUrl: link.href,
                                    originalUrl: getOriginalDownloadUrl(videoId)
                                };
                                break;
                            }
                        }
                    }
                }
                
                if (currentVideo) break;
            }
            
            return currentVideo;
            
        } catch (e) {
            console.error("Error finding currently playing video:", e);
            return null;
        }
    }
    
    // Create download text for current video (with metadata and instructions)
    function createCurrentVideoDownloadText(video) {
        let text = '';
        
        text += `# TikTok Original Video Download Link\n`;
        text += `# Generated on: 2025-03-21 21:36:13\n`;
        text += `# Created by: diepvantien\n`;
        text += `# Video ID: ${video.id}\n\n`;
        text += `# INSTRUCTIONS FOR DOWNLOADING:\n`;
        text += `# 1. Import this link into a download manager (IDM, aria2c, etc.)\n`;
        text += `# 2. Make sure to use these HTTP headers when downloading:\n`;
        text += `#    User-Agent: TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet\n`;
        text += `#    Referer: https://www.tiktok.com/\n\n`;
        text += `# FORMAT: original_url|filename\n\n`;
        text += `${video.originalUrl}|tiktok_${video.id}.mp4\n`;
        
        return text;
    }
    
    // Function to download a single video
    function downloadVideo(video, index) {
        return new Promise((resolve) => {
            try {
                const prefix = isLikedTab ? `${profileUsername}_liked` : profileUsername;
                const filename = `${prefix}_video_${index + 1}.mp4`;
                
                const a = document.createElement('a');
                a.href = video.originalUrl;
                a.download = filename;
                a.target = '_blank';
                a.style.display = 'none';
                
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    resolve();
                }, 1000); // Give browser 1 second delay between downloads
            } catch (e) {
                console.error("Error downloading video:", e);
                resolve(); // Continue even if there's an error
            }
        });
    }
    
    // Function to download all videos sequentially
    async function downloadAllVideos() {
        if (videoCollection.length === 0) {
            alert('No videos found yet. Let the auto-scroll complete first!');
            return;
        }
        
        if (isDownloading) {
            alert('Download already in progress!');
            return;
        }
        
        isDownloading = true;
        currentDownloadIndex = 0;
        
        // Show download progress UI
        if (downloadProgress) {
            downloadProgress.style.display = 'block';
        }
        
        if (statusMessage) {
            statusMessage.textContent = 'Downloading all videos...';
        }
        
        // Notify user about potential browser popup blocks
        alert('The download process will start now. If your browser blocks popups, please allow them to continue downloading.');
        
        // Update progress UI
        updateDownloadProgress();
        
        // Download videos sequentially
        for (let i = 0; i < videoCollection.length; i++) {
            currentDownloadIndex = i;
            updateDownloadProgress();
            await downloadVideo(videoCollection[i], i);
        }
        
        if (statusMessage) {
            statusMessage.textContent = `Downloaded ${videoCollection.length} videos!`;
        }
        
        isDownloading = false;
    }
    
    // Update download progress UI
    function updateDownloadProgress() {
        if (downloadCount && videoCollection.length > 0) {
            downloadCount.textContent = `${currentDownloadIndex + 1}/${videoCollection.length}`;
        }
        
        if (downloadProgressBar && videoCollection.length > 0) {
            const percentage = Math.round(((currentDownloadIndex + 1) / videoCollection.length) * 100);
            downloadProgressBar.style.width = `${percentage}%`;
        }
    }
    
    // Handle current video button click
    function handleCurrentVideoClick() {
        const currentVideo = getCurrentlyPlayingVideo();
        
        if (!currentVideo) {
            statusMessage.textContent = 'No video currently playing found';
            urlContainer.innerHTML = `<div style="color: #e53e3e; text-align: center;">Couldn't detect current video</div>`;
            return;
        }
        
        // Display the current video information
        statusMessage.textContent = `Current video found! ID: ${currentVideo.id}`;
        urlContainer.innerHTML = `
            <div style="margin-bottom: 8px; padding: 10px; background: #2d3748; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #48bb78;">Currently Playing Video</span>
                    <span style="color: #a0aec0; font-size: 10px;">${currentVideo.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                    <button id="download-current-txt" style="padding: 5px 10px; background: #2563eb; border: none; color: white; border-radius: 4px; cursor: pointer; font-size: 11px;">
                        Download Link (.txt)
                    </button>
                    <button id="download-current-video" style="padding: 5px 10px; background: #10b981; border: none; color: white; border-radius: 4px; cursor: pointer; font-size: 11px;">
                        Download Video
                    </button>
                </div>
            </div>
        `;
        
        // Download link as text file (with metadata and instructions)
        document.getElementById('download-current-txt').addEventListener('click', () => {
            try {
                const text = createCurrentVideoDownloadText(currentVideo);
                const filename = `tiktok_${currentVideo.id}_download_link.txt`;
                
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                statusMessage.textContent = `Download link saved as ${filename}!`;
            } catch (e) {
                console.error("Error downloading file:", e);
                alert('Download failed. Browser may be blocking downloads.');
            }
        });
        
        // Direct download video
        document.getElementById('download-current-video').addEventListener('click', () => {
            try {
                const filename = `tiktok_${currentVideo.id}.mp4`;
                
                const a = document.createElement('a');
                a.href = currentVideo.originalUrl;
                a.download = filename;
                a.target = '_blank';
                a.style.display = 'none';
                
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                }, 100);
                
                statusMessage.textContent = 'Video download started!';
            } catch (e) {
                console.error("Error starting download:", e);
                alert('Download failed. Browser may be blocking downloads.');
            }
        });
    }
    
    function findVideoElements() {
        // Based on your HTML structure, adjust selectors for both profile and liked videos
        let newElements = [];
        
        if (isLikedTab) {
            // Target the specific structure for liked videos
            const likedContainers = document.querySelectorAll('div[data-e2e="user-liked-item-list"]');
            likedContainers.forEach(container => {
                const items = container.querySelectorAll('div[data-e2e="user-liked-item"]');
                newElements = [...newElements, ...items];
            });
            
            // Fallback selector if the above doesn't find anything
            if (newElements.length === 0) {
                newElements = Array.from(document.querySelectorAll('div[data-e2e="user-liked-item"]'));
            }
            
            // Last resort fallback
            if (newElements.length === 0) {
                newElements = Array.from(document.querySelectorAll('div[class*="DivItemContainer"] a[href*="/video/"]'))
                    .map(a => a.closest('div[class*="DivItemContainer"]'))
                    .filter(div => div !== null);
            }
        } else {
            // For profile videos
            newElements = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"]'));
            
            // Fallback
            if (newElements.length === 0) {
                newElements = Array.from(document.querySelectorAll('div[class*="DivItemContainer"] a[href*="/video/"]'))
                    .map(a => a.closest('div[class*="DivItemContainer"]'))
                    .filter(div => div !== null);
            }
        }
        
        // Add all new elements to our collection
        videoElements = [...videoElements, ...newElements];
        const oldCount = totalVideos;
        totalVideos = videoElements.length;
        
        // Process all video elements to extract video IDs
        let foundNewVideos = false;
        videoElements.forEach(element => {
            try {
                // Get all anchors inside this element
                const links = element.querySelectorAll('a[href*="/video/"]');
                
                if (links.length > 0) {
                    links.forEach(link => {
                        if (link.href && link.href.includes('/video/')) {
                            const videoId = extractVideoId(link.href);
                            if (videoId && !videoCollection.some(v => v.id === videoId)) {
                                videoCollection.push({
                                    id: videoId,
                                    pageUrl: link.href,
                                    originalUrl: getOriginalDownloadUrl(videoId)
                                });
                                foundNewVideos = true;
                            }
                        }
                    });
                } else {
                    // Try to find an anchor that is a parent
                    const parentLink = element.closest('a[href*="/video/"]');
                    if (parentLink && parentLink.href) {
                        const videoId = extractVideoId(parentLink.href);
                        if (videoId && !videoCollection.some(v => v.id === videoId)) {
                            videoCollection.push({
                                id: videoId,
                                pageUrl: parentLink.href,
                                originalUrl: getOriginalDownloadUrl(videoId)
                            });
                            foundNewVideos = true;
                        }
                    }
                }
            } catch (e) {
                console.error("Error processing video element:", e);
            }
        });
        
        if (oldCount !== totalVideos || foundNewVideos) {
            // Fix for null element error
            if (captureRatio && progressBar) {
                updateUI();
            }
            return true;
        }
        
        return false;
    }
    
    function updateUI() {
        // Check if elements exist before updating
        if (!captureRatio || !progressBar) return;
        
        captureRatio.textContent = `Links: ${videoCollection.length}/${totalVideos}`;
        
        const percentage = totalVideos > 0 ? Math.min(100, Math.round((videoCollection.length / totalVideos) * 100)) : 0;
        progressBar.style.width = `${percentage}%`;
        
        if (completionStatus) {
            if (isScrolling) {
                completionStatus.textContent = `Auto-scrolling to find videos (${percentage}% captured)`;
            } else {
                completionStatus.textContent = `Found ${videoCollection.length} of ${totalVideos} videos`;
            }
        }
        
        if (videoCollection.length >= totalVideos && !isComplete && totalVideos > 0) {
            progressBar.style.background = '#48bb78';
            if (statusMessage) {
                statusMessage.textContent = 'All videos found! Ready to download.';
            }
            isComplete = true;
            
            if (isScrolling) {
                stopAutoScroll();
            }
        }
        
        if (videoCollection.length === 0) {
            if (urlContainer) {
                urlContainer.innerHTML = `<div style="color: #a0aec0; text-align: center;">No videos found yet...</div>`;
            }
            return;
        }
        
        // Thay đổi nội dung hiển thị để ẩn danh sách video
        if (urlContainer) {
            urlContainer.innerHTML = `<div style="color: #48bb78; text-align: center;">
                ${videoCollection.length} videos found!
                <div style="color: #a0aec0; font-size: 10px; margin-top: 5px;">
                    Press "Download All Videos" to start batch download
                </div>
            </div>`;
        }
    }
    
    function startAutoScroll() {
        if (scrollInterval) return;
        
        isScrolling = true;
        scrollConfig.scrollsWithNoNewVideos = 0;
        
        findVideoElements();
        
        scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollConfig.scrollAmount);
            
            const scrolledToBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100;
            
            const foundNewVideos = findVideoElements();
            
            if (!foundNewVideos) {
                scrollConfig.scrollsWithNoNewVideos++;
                
                if (scrollConfig.scrollsWithNoNewVideos === 3) {
                    window.scrollTo(0, document.body.scrollHeight);
                } 
                
                if (scrollConfig.scrollsWithNoNewVideos >= scrollConfig.noNewVideoLimit || scrolledToBottom) {
                    stopAutoScroll();
                }
            } else {
                scrollConfig.scrollsWithNoNewVideos = 0;
            }
        }, scrollConfig.scrollInterval);
    }
    
    function stopAutoScroll() {
        if (!isScrolling) return;
        
        clearInterval(scrollInterval);
        scrollInterval = null;
        isScrolling = false;
        
        if (stopScrollButton) {
            stopScrollButton.textContent = 'Resume Auto-Scroll';
            stopScrollButton.style.background = '#6366f1';
        }
        
        if (statusMessage) {
            statusMessage.textContent = 'Ready to download';
        }
    }
    
    function createDownloadText() {
        let text = '';
        
        const prefix = isLikedTab ? 'liked videos' : 'profile videos';
        
        text += `# TikTok Original Video Download Links for @${profileUsername} (${prefix})\n`;
        text += `# Generated on: 2025-03-21 21:36:13\n`;
        text += `# Created by: diepvantien\n`;
        text += `# Number of videos: ${videoCollection.length}\n\n`;
        text += `# INSTRUCTIONS FOR DOWNLOADING:\n`;
        text += `# 1. Import these links into a download manager (IDM, aria2c, etc.)\n`;
        text += `# 2. Make sure to use these HTTP headers when downloading:\n`;
        text += `#    User-Agent: TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet\n`;
        text += `#    Referer: https://www.tiktok.com/\n\n`;
        text += `# FORMAT: original_url|filename\n\n`;
        
        const filePrefix = isLikedTab ? `${profileUsername}_liked` : profileUsername;
        
        videoCollection.forEach((video, index) => {
            text += `${video.originalUrl}|${filePrefix}_video_${index + 1}.mp4\n`;
        });
        
        return text;
    }
    
    function downloadLinksFile() {
        if (videoCollection.length === 0) {
            alert('No videos found yet. Let the auto-scroll complete first!');
            return;
        }
        
        const text = createDownloadText();
        const section = isLikedTab ? 'liked' : 'profile';
        const filename = `${profileUsername}_${section}_${videoCollection.length}_original_links.txt`;
        
        try {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            if (statusMessage) {
                statusMessage.textContent = `Downloaded ${videoCollection.length} links!`;
            }
        } catch (e) {
            console.error("Error downloading file:", e);
            alert('Download failed. Browser may be blocking downloads.');
        }
    }
    
    // Setup event listeners
    if (downloadLinksBtn) {
        downloadLinksBtn.addEventListener('click', downloadLinksFile);
    }
    
    if (downloadAllVideosBtn) {
        downloadAllVideosBtn.addEventListener('click', downloadAllVideos);
    }
    
    if (currentVideoBtn) {
        currentVideoBtn.addEventListener('click', handleCurrentVideoClick);
    }
    
    if (stopScrollButton) {
        stopScrollButton.addEventListener('click', () => {
            if (isScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
                stopScrollButton.textContent = 'Stop Auto-Scroll';
                stopScrollButton.style.background = '#d69e2e';
            }
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }
            document.body.removeChild(container);
        });
    }
    
    // Add debug information
    console.log('[TikTok Downloader] Started in ' + (isLikedTab ? 'LIKED' : 'PROFILE') + ' mode');
    console.log('[TikTok Downloader] User: ' + profileUsername);
    
    // Start the auto-scrolling process
    startAutoScroll();
})();