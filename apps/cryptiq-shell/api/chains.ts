// cryptiq-shell/api/chains.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

export default async function (fastify: FastifyInstance) {
  fastify.get('/chains', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const response = await axios.get('http://localhost:5007/chains');
      reply.send(response.data);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch chains' });
    }
  });
}