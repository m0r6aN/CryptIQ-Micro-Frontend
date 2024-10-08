import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getWalletBalance } from '../../../services/wallet-service';

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/wallet', async (request: FastifyRequest, reply: FastifyReply) => {
    const { address } = request.body as { address: string };

    try {
      const balance = await getWalletBalance(address);
      reply.send({ success: true, balance });
    } catch (error) {
      const err = error as Error; // Type assertion
      reply.status(500).send({ success: false, error: err.message });
    }
  });
}
