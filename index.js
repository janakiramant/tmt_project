import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logging } from '@google-cloud/logging';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Cloud Logging
const logging = new Logging();
const log = logging.log('tmt-project-log');

const app = express();
const port = process.env.PORT || 8080;

/**
 * Middleware to log requests using Google Cloud Logging
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
app.use((req, res, next) => {
  const metadata = { resource: { type: 'global' } };
  const entry = log.entry(metadata, `Request received: ${req.method} ${req.url}`);
  log.write(entry).catch(console.error);
  next();
});

/**
 * Health Check endpoint for Cloud Run startup probe
 * @name get/health
 * @function
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * API Endpoint to securely serve Firebase configuration
 * Retrieves secrets injected as environment variables via Google Secret Manager
 * @name get/api/config
 * @function
 */
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  });
});

// Serve the static files built by Vite
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * Catch-all route to serve the React application
 * @name use/*
 * @function
 */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port', port);
  });
}

export default app;
