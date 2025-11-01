export interface VideoPlatform {
  type: 'youtube' | 'tiktok' | 'instagram' | 'unknown';
  id?: string;
}

export const validateVideoUrl = (url: string): VideoPlatform => {
  try {
    const urlObj = new URL(url);
    
    // YouTube validation
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId: string | undefined;
      
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || undefined;
      }
      
      return { type: 'youtube', id: videoId };
    }
    
    // TikTok validation
    if (urlObj.hostname.includes('tiktok.com')) {
      const videoId = urlObj.pathname.split('/video/')[1]?.split('?')[0];
      return { type: 'tiktok', id: videoId };
    }
    
    // Instagram validation
    if (urlObj.hostname.includes('instagram.com')) {
      const reelId = urlObj.pathname.split('/reel/')[1]?.split('/')[0];
      return { type: 'instagram', id: reelId };
    }
    
    return { type: 'unknown' };
  } catch (error) {
    return { type: 'unknown' };
  }
};