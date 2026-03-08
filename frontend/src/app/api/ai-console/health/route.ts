import { NextResponse } from 'next/server';
import { getBackendUrl } from '../config';

/**
 * API Route: GET /api/ai-console/health
 * Proxies health check requests to the backend API
 */
export async function GET() {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/ai-console/health`);

    const contentType = response.headers.get('content-type');
    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
      }
      return NextResponse.json({ success: true, status: 'online' }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, status: 'error' },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'offline',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
