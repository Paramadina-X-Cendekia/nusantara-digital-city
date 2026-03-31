/**
 * Converts various YouTube URL formats to an embedUrl.
 * @param {string} url 
 * @returns {string} 
 */
export function getYoutubeEmbedUrl(url) {
    if (!url) return '';
    
    // If it's already an embed URL, return it
    if (url.includes('youtube.com/embed/')) return url;
    
    let videoId = '';
    
    // Handle youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch) {
        videoId = watchMatch[1];
    } else {
        // Handle youtu.be/ID
        const shortMatch = url.match(/youtu\.be\/([^&#?]+)/);
        if (shortMatch) {
            videoId = shortMatch[1];
        } else {
            // Handle youtube.com/shorts/ID
            const shortsMatch = url.match(/youtube\.com\/shorts\/([^&#?]+)/);
            if (shortsMatch) {
                videoId = shortsMatch[1];
            }
        }
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}
