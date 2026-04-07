const express = require('express');
const pinoHttp = require('pino-http');
const config = require('./config');
const logger = require('./logger');
const moviesRouter = require('./routes/movies');
const authMiddleware = require('./middleware/auth');
const { connectRedis, disconnectRedis } = require('./services/redis');

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

// Health check — no auth required
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'movie-service', timestamp: new Date().toISOString() });
});

// Protected routes
app.use('/movies', authMiddleware, moviesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

let server;
let shuttingDown = false;

async function start() {
  await connectRedis();

  server = app.listen(config.port, () => {
    logger.info({ port: config.port }, 'Movie service started');
  });

  // Allow keep-alive connections to be closed during shutdown
  server.keepAliveTimeout = 65 * 1000;
  server.headersTimeout = 66 * 1000;
}

// Graceful shutdown — drain in-flight requests before exiting
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info({ signal }, 'Shutdown signal received — draining connections');

  if (server) {
    // Stop accepting new connections and wait for in-flight requests to finish
    await new Promise((resolve) => {
      server.close(() => {
        logger.info('HTTP server closed — all in-flight requests drained');
        resolve();
      });

      // Force close after 10s if requests don't finish
      setTimeout(() => {
        logger.warn('Forced shutdown after drain timeout');
        resolve();
      }, 10000);
    });
  }

  await disconnectRedis();
  logger.info('Cleanup complete — exiting');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  logger.error({ err }, 'Failed to start');
  process.exit(1);
});
