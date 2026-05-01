// Configuration for API endpoints
// Change this to your production URL when hosting
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  API_PREFIX: "/api",
  get FULL_URL() {
    return `${this.BASE_URL}${this.API_PREFIX}`;
  },
  // Helper for image URLs
  getImageUrl: (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  }
};
