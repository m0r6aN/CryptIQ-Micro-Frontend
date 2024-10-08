import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { connectExchange } from '../../../services/exchange-service';

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/exchange', async (request: FastifyRequest, reply: FastifyReply) => {
    const { exchangeId, apiKey, secretKey } = request.body as { exchangeId: string; apiKey: string; secretKey: string };

    try {
      const balance = await connectExchange(exchangeId, { apiKey, secretKey });
      reply.send({ success: true, balance });
    } catch (error) {
      reply.status(500).send({ success: false, error: error.message });
    }
  });
}