// app/api/[[...route]]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fastify } from '../../api/server';  // Correctly import the fastify instance

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  if (url.pathname.includes('/portfolio')) {
    const portfolioId = url.searchParams.get('portfolioId');
    const search = url.searchParams.get('search') ?? '';
    const offset = url.searchParams.get('offset') ?? '0';

    const response = await fastify.inject({
      method: 'GET',
      url: `/portfolio/${portfolioId}/assets?search=${search}&offset=${offset}`,
      headers: Object.fromEntries(request.headers),
    });

    return new NextResponse(response.payload, {
      status: response.statusCode,
      headers: response.headers as HeadersInit,
    });
  }
  
  // Generic GET request handler for other routes
  const response = await fastify.inject({
    method: 'GET',
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers),
  });

  return new NextResponse(response.payload, {
    status: response.statusCode,
    headers: response.headers as HeadersInit,
  });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const body = await request.text();
  const response = await fastify.inject({
    method: 'POST',
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers),
    payload: body,
  });

  return new NextResponse(response.payload, {
    status: response.statusCode,
    headers: response.headers as HeadersInit,
  });
}

// Implement other HTTP methods (PUT, DELETE, etc.) similarly if needed
