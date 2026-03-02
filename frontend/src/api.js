// This file automatically uses the correct API URL
// locally: http://localhost:5000
// on Vercel: your Render backend URL (set in .env)

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default API;
