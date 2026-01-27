import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Configuration object
const config = {
  node_env: process.env.NODE_ENV,
  is_production: process.env.NODE_ENV === 'production',
  origin: process.env.CORS_ORIGIN,
  uiLink: process.env.UI_LINK,
  port: process.env.PORT || 8080,
  mongodbURI: process.env.MONGODB_URI,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  gmail: process.env.GMAIL_ADDRESS,
  gmail_pass: process.env.GMAIL_PASSWORD,
};

export default config;
