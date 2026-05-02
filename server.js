import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Port Binding & Host Configuration
// Cloud Run provides the PORT environment variable. If not set, default to 8080.
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // Bind to all interfaces to allow external traffic

// 2. Health Check readiness endpoint for Cloud Run startup probe
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve the static files built by Vite
app.use(express.static(path.join(__dirname, 'dist')));

// For any other route, send the index.html file so React Router can handle it
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 3. Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is starting...`);
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`Health check available at http://${HOST}:${PORT}/health`);
});
