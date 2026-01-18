/**
 * Shared configuration for AI Console API routes
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Get the backend API URL from environment variables
 * Priority: NEXT_PUBLIC_API_URL > BACKEND_API_URL > localhost fallback
 */
export function getBackendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.BACKEND_API_URL || 
    'http://localhost:3001'
  );
}

/**
 * Proxy a POST request to the backend API
 * @param request - The incoming Next.js request
 * @param endpoint - The backend endpoint path (e.g., '/api/ai-console/analyze')
 * @returns NextResponse with the backend's response or error
 */
export async function proxyToBackend(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    const backendUrl = getBackendUrl();
    const targetUrl = `${backendUrl}${endpoint}`;
    
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
    console.error(`Proxy error for ${endpoint}:`, error);
    
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
