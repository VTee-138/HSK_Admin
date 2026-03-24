// Config for different environments
const config = {
  development: {
    REACT_APP_API_BASE_URL: "http://localhost:4000/api/v2",
    HOSTNAME: "http://localhost:4000",
  },
  production: {
    REACT_APP_API_BASE_URL: "https://backend.tiengtrung86hsk.com/api/v2",
    HOSTNAME: "https://backend.tiengtrung86hsk.com",
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'production';
const currentConfig = config[env] || config.production;

export const REACT_APP_API_BASE_URL = currentConfig.REACT_APP_API_BASE_URL;
export const HOSTNAME = currentConfig.HOSTNAME;

// For backward compatibility
export default currentConfig;
