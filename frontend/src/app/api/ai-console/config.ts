/**
 * Shared configuration for AI Console API routes
 */

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
