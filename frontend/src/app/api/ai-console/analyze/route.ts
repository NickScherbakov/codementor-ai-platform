import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../config';

/**
 * API Route: POST /api/ai-console/analyze
 * Proxies code analysis requests to the backend API
 */
export async function POST(request: NextRequest) {
  try {
    const backendUrl = getBackendUrl();
    const targetUrl = `${backendUrl}/api/ai-console/analyze`;
    
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }
    
    // Forward request to backend
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: 'Backend returned non-JSON response',
          details: text,
        },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error('Proxy error in /api/ai-console/analyze:', error);
    
    // Return 500 with error context on proxy failure
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to backend service',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
