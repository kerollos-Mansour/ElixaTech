// Configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  API_PREFIX: "/api",
  get FULL_URL() {
    return `${this.BASE_URL}${this.API_PREFIX}`;
  },
  // Final robust helper for image URLs
  getImageUrl: (data?: any) => {
    if (!data) return null;
    
    let path: string | null = null;

    // 1. Handle Array of images (newly discovered structure)
    if (Array.isArray(data) && data.length > 0) {
      const mainImage = data.find(img => img.isMain) || data[0];
      path = mainImage.url || mainImage.path || mainImage.image;
    } 
    // 2. Handle single object
    else if (typeof data === 'object') {
      path = data.url || data.path || data.imageUrl || data.image;
    } 
    // 3. Handle string
    else if (typeof data === 'string') {
      path = data;
    }

    if (!path || typeof path !== 'string') return null;
    
    // Cloudinary or absolute URLs
    if (path.startsWith("http")) return path;
    
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }
};
