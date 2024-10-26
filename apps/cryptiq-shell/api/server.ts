// cryptiq-shell/api/server.ts

import Fastify, { FastifyInstance } from 'fastify';
import walletRoutes from './wallets';
import exchangeRoutes from './exchange';
import chainsRoutes from './chains';

const fastify: FastifyInstance = Fastify({ logger: true });

// Register API routes
fastify.register(walletRoutes, { prefix: '/api' });
fastify.register(exchangeRoutes, { prefix: '/api' });
fastify.register(chainsRoutes, { prefix: '/api' });

const startServer = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:4000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Export the fastify instance
export { fastify };

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}