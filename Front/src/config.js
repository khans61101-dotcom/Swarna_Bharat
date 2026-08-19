export const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const host = window.location.hostname || 'localhost';
    const port = window.location.port;

    // Vite dev server running locally on port 5173/5174/3001/5175
    if (port === '5173' || port === '5174' || port === '3001' || port === '5175') {
      return `${protocol}//${host}:3000`;
    }

    // Localhost or LAN IP
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
      return `${protocol}//${host}:3000`;
    }
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
})();

export const API_URL = `${API_BASE_URL}/api`;

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
};
