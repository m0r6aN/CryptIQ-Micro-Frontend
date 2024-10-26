// cryptiq-shell/api/exchange.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

export default async function (fastify: FastifyInstance) {
  fastify.post('/exchange', async (request: FastifyRequest, reply: FastifyReply) => {
    const { exchangeId, apiKey, secretKey } = request.body as { exchangeId: string; apiKey: string; secretKey: string };

    try {
      const response = await axios.post('http://localhost:5001/connect', { exchangeId, apiKey, secretKey });
      reply.send({ success: true, balance: response.data.balance });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      reply.status(500).send({ success: false, error: errorMessage });
    }
  });
}