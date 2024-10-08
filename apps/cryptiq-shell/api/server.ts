import Fastify from 'fastify';
import walletRoutes from './wallet';
import exchangeRoutes from './exchange';

const startServer = async () => {
  const fastify = Fastify({ logger: true });

  // Register API routes
  fastify.register(walletRoutes);
  fastify.register(exchangeRoutes);

  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:4000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();

// Port Configuration: This will run on port 4000. Adjust it if needed based on your Docker setup.
// Route Registration: We register our API routes for wallets and exchanges here.