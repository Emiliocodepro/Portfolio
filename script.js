function waitForPeachWorldLoad() {
    const iframe = document.querySelector('iframe');
    const overlay = document.getElementById('loadingOverlay');
    let loadStartTime = Date.now();
    
    function checkIframeContent() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - loadStartTime;
        
        try {
            // Try to access iframe content
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                // Wait additional time to ensure Peach World's loading animation is complete
                const remainingWait = Math.max(2500 - timeElapsed, 0);
                
                setTimeout(() => {
                    // Add 1 second delay as requested
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.style.display = 'none';
                        }, 1000);
                    }, 1000);
                }, remainingWait);
                return;
            }
        } catch (e) {
            // If we can't access iframe content, continue checking
        }
        
        // Check again in a short interval if not complete
        if (timeElapsed < 10000) { // Set maximum wait time to 10 seconds
            requestAnimationFrame(checkIframeContent);
        } else {
            // Fallback: If taking too long, hide overlay anyway
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 1000);
            }, 1000);
        }
    }

    // Start checking once iframe begins loading
    loadStartTime = Date.now();
    checkIframeContent();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', waitForPeachWorldLoad);
