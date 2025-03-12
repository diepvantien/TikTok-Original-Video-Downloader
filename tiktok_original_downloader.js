/**
 * TikTok Original Quality Video Downloader
 * Date: 2025-03-12 05:05:13
 * User: diepvantien
 * 
 * This script extracts original quality no-watermark download links
 * - Auto-scrolls automatically to find all videos
 * - Generates direct download links for original quality
 * 
 * Support the developer:
 * - Momo: 0868442806
 * - Vietinbank: 109866849450
 */
(function() {
    let profileUsername = location.pathname.split('/')[1];
    if (profileUsername && profileUsername.startsWith('@')) {
        profileUsername = profileUsername.substring(1);
    } else {
        profileUsername = 'tiktok';
    }
    
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
            <div>User: <span id="current-user" style="color: #4ade80;">diepvantien</span></div>
            <div>Time: <span id="current-time" style="color: #4ade80;">2025-03-12 05:05:13</span></div>
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
            <div style="margin-bottom: 5px; color: #a0aec0;">Author: diepvantien</div>
            <div style="margin-bottom: 3px;">
                <span>Momo:</span> 
                <span style="color: #63b3ed;">0868442806</span>
            </div>
            <div style="color: #a0aec0;">Vietinbank: 109866849450</div>
        </div>
        
        <div style="margin-top: 8px; font-size: 11px; color: #a0aec0; line-height: 1.4;">
            <span id="completion-status">Auto-scrolling to find videos (0%)...</span>
        </div>
    `;
    
    document.body.appendChild(container);
    
    const statusMessage = document.getElementById('status-message');
    const captureRatio = document.getElementById('capture-ratio');
    const urlContainer = document.getElementById('url-container');
    const progressBar = document.getElementById('progress-bar');
    const completionStatus = document.getElementById('completion-status');
    const downloadLinksBtn = document.getElementById('download-links');
    const copyLinksBtn = document.getElementById('copy-links');
    const stopScrollButton = document.getElementById('stop-scroll');
    const closeButton = document.getElementById('close-button');
    
    let videoCollection = [];
    let videoElements = [];
    let totalVideos = 0;
    let isScrolling = true;
    let scrollInterval = null;
    let isComplete = false;
    
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
    
    function findVideoElements() {
        videoElements = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"]'));
        const oldCount = totalVideos;
        totalVideos = videoElements.length;
        
        videoElements.forEach(element => {
            try {
                const link = element.querySelector('a');
                if (link && link.href && link.href.includes('/video/')) {
                    const videoId = extractVideoId(link.href);
                    if (videoId && !videoCollection.some(v => v.id === videoId)) {
                        videoCollection.push({
                            id: videoId,
                            pageUrl: link.href,
                            originalUrl: getOriginalDownloadUrl(videoId)
                        });
                    }
                }
            } catch (e) {}
        });
        
        if (oldCount !== totalVideos || videoCollection.length !== oldCount) {
            updateUI();
            console.log(`Found ${totalVideos} videos, collected ${videoCollection.length} URLs`);
            return true;
        }
        
        return false;
    }
    
    function updateUI() {
        captureRatio.textContent = `Links: ${videoCollection.length}/${totalVideos}`;
        
        const percentage = totalVideos > 0 ? Math.min(100, Math.round((videoCollection.length / totalVideos) * 100)) : 0;
        progressBar.style.width = `${percentage}%`;
        
        if (isScrolling) {
            completionStatus.textContent = `Auto-scrolling to find videos (${percentage}% captured)`;
        } else {
            completionStatus.textContent = `Found ${videoCollection.length} of ${totalVideos} videos`;
        }
        
        if (videoCollection.length >= totalVideos && !isComplete && totalVideos > 0) {
            progressBar.style.background = '#48bb78';
            statusMessage.textContent = 'All videos found! Ready to download.';
            isComplete = true;
            
            if (isScrolling) {
                stopAutoScroll();
            }
        }
        
        if (videoCollection.length === 0) {
            urlContainer.innerHTML = `<div style="color: #a0aec0; text-align: center;">No videos found yet...</div>`;
            return;
        }
        
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
                completionStatus.textContent = `Scrolling... No new videos for ${scrollConfig.scrollsWithNoNewVideos} scrolls`;
                
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
        
        console.log(`Started auto-scrolling to find videos`);
    }
    
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
    
    function createDownloadText() {
        let text = '';
        
        text += `# TikTok Original Video Download Links for @${profileUsername}\n`;
        text += `# Generated on: 2025-03-12 05:05:13\n`;
        text += `# Created by: diepvantien\n`;
        text += `# Number of videos: ${videoCollection.length}\n\n`;
        text += `# INSTRUCTIONS FOR DOWNLOADING:\n`;
        text += `# 1. Import these links into a download manager (IDM, aria2c, etc.)\n`;
        text += `# 2. Make sure to use these HTTP headers when downloading:\n`;
        text += `#    User-Agent: TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet\n`;
        text += `#    Referer: https://www.tiktok.com/\n\n`;
        text += `# FORMAT: original_url|filename\n\n`;
        
        videoCollection.forEach((video, index) => {
            text += `${video.originalUrl}|${profileUsername}_video_${index + 1}.mp4\n`;
        });
        
        return text;
    }
    
    function downloadLinksFile() {
        if (videoCollection.length === 0) {
            alert('No videos found yet. Let the auto-scroll complete first!');
            return;
        }
        
        const text = createDownloadText();
        
        const filename = `${profileUsername}_${videoCollection.length}_original_links.txt`;
        
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
            
            statusMessage.textContent = `Downloaded ${videoCollection.length} links!`;
        } catch (e) {
            console.error("Error downloading file:", e);
            alert('Download failed. Browser may be blocking downloads.');
        }
    }
    
    function copyAllLinks() {
        if (videoCollection.length === 0) {
            alert('No videos found yet. Let the auto-scroll complete first!');
            return;
        }
        
        const text = createDownloadText();
        
        navigator.clipboard.writeText(text)
            .then(() => {
                statusMessage.textContent = `Copied ${videoCollection.length} links to clipboard!`;
                setTimeout(() => {
                    statusMessage.textContent = isScrolling ? 'Auto-scrolling in progress...' : `Found ${videoCollection.length} videos`;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy links:', err);
                alert('Failed to copy links to clipboard. Try the download button instead.');
            });
    }
