// cryptiq-shell/api/wallets.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

export default async function (fastify: FastifyInstance) {
  fastify.get('/wallets', async (request: FastifyRequest, reply: FastifyReply) => {
    const { chain_id } = request.query as { chain_id?: string };

    try {
      const response = await axios.get(`http://localhost:8000/wallets${chain_id ? `?chain_id=${chain_id}` : ''}`);
      reply.send(response.data);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch wallets' });
    }
  });
}