// API Configuration
// Always use /api – Vite proxies to backend in dev, nginx proxies in production
const API_BASE = '/api';

// Image Compression Configuration
export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 800,
  MAX_HEIGHT: 800,
  QUALITY: 0.8,
  MAX_SIZE_KB: 500
};

export const API_ENDPOINTS = {
  // Security
  csrfToken: `${API_BASE}/csrf-token`,

  // AI
  generatePetDescription: `${API_BASE}/generate-pet-description`,
  aiRateLimit: `${API_BASE}/ai-rate-limit`,
  getAIRateLimitStatus: `${API_BASE}/ai-rate-limit`,
};

export default API_ENDPOINTS;
