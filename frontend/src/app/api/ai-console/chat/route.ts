import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: POST /api/ai-console/chat
 * Proxies chat requests to the backend API
 */
export async function POST(request: NextRequest) {
  try {
    // Get backend URL from environment variables with fallback to localhost
    const backendUrl = 
      process.env.NEXT_PUBLIC_API_URL || 
      process.env.BACKEND_API_URL || 
      'http://localhost:3001';
    
    const targetUrl = `${backendUrl}/api/ai-console/chat`;
    
    // Parse request body
    const body = await request.json();
    
    // Forward request to backend
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get response data
    const data = await response.json();
    
    // Return response with same status code as backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error in /api/ai-console/chat:', error);
    
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
