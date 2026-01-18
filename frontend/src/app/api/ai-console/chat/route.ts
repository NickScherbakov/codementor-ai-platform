import { NextRequest } from 'next/server';
import { proxyToBackend } from '../config';

/**
 * API Route: POST /api/ai-console/chat
 * Proxies chat requests to the backend API
 */
export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/api/ai-console/chat');
}
