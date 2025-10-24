// API Configuration
// Priority:
// 1) VITE_API_URL from environment (set in Vercel Project settings)
// 2) If running on Vercel, infer the server URL from known domain
// 3) Fallback to localhost during local development
const inferredVercelServer = 'https://beat-blog-server.vercel.app';
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location?.hostname?.includes('vercel.app')
    ? inferredVercelServer
    : 'http://localhost:4001');

export default API_URL;

