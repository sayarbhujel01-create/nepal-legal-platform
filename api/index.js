import { handleRequest } from '../server.js';

export default async function handler(req, res) {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error('Unhandled Vercel serverless function error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>500 - Internal Platform Error</h1><p>${err.message}</p>`);
    }
  }
}
