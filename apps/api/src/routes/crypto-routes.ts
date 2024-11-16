import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import sensible from '@fastify/sensible'
import { supabaseClient } from '../utils/supabase/client'; // Regular client for authenticated users
import { supabaseAdmin } from '../utils/supabase/server'; // Admin client for privileged operations

const cryptoRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(sensible)

  const fetchFromBackend = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw fastify.httpErrors.createError(response.status, await response.text())
    }
    return response.json()
  }

  const fetchFromBotService = async (endpoint: string) => {
    const url = `http://bot-service:8001${endpoint}`
    const response = await fetch(url)
    if (!response.ok) {
      throw fastify.httpErrors.createError(response.status, await response.text())
    }
    return response.json()
  }

  const querySchema = z.object({
    limit: z.string().optional(),
    day_trading_filter: z.string().optional(),
  })

  fastify.get('/top-coins', {
    schema: {
      querystring: {
        limit: { type: 'string' },
        day_trading_filter: { type: 'string' },
      },
    },
    handler: async (request, reply) => {
      const { limit, day_trading_filter } = querySchema.parse(request.query)
      
      const backendUrl = new URL(`${process.env.BACKEND_URL}/top-coins`)
      if (limit) backendUrl.searchParams.append('limit', limit)
      if (day_trading_filter) backendUrl.searchParams.append('day_trading_filter', day_trading_filter)

      try {
        const data = await fetchFromBackend(backendUrl.toString())
        return reply.send(data)
      } catch (error) {
        fastify.log.error(error)
        throw fastify.httpErrors.internalServerError('Failed to fetch data from backend service')
      }
    },
  })
}

// New route to interact with the bot service
fastify.get('/bot-strategy', async (request, reply) => {
  try {
    const data = await fetchFromBotService('/strategy')
    return reply.send(data)
  } catch (error) {
    fastify.log.error(error)
    throw fastify.httpErrors.internalServerError('Failed to fetch data from bot service')
  }
})

// New route to execute a trade
fastify.post('/execute-trade', {
  schema: {
    body: {
      symbol: { type: 'string' },
      amount: { type: 'number' },
    },
  },
  handler: async (request, reply) => {
    const { symbol, amount } = request.body as { symbol: string; amount: number }
    try {
      const data = await fetchFromBotService('/execute-trade')
      return reply.send(data)
    } catch (error) {
      fastify.log.error(error)
      throw fastify.httpErrors.internalServerError('Failed to execute trade')
    }
  },
})
}

export default cryptoRoutes