'use client'

const AUTH_TOKEN_KEY = 'authToken'

export type ApiErrorPayload = {
  success?: boolean
  error?: string
  message?: string
  errors?: Array<{ msg?: string; message?: string }>
  retryAfterSeconds?: number
}

function normalizeErrorMessage(payload: ApiErrorPayload | null, fallback: string) {
  if (!payload) {
    return fallback
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors
      .map((entry) => entry.msg || entry.message)
      .filter(Boolean)
      .join(', ')
  }

  return payload.message || payload.error || fallback
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, requireAuth = false): Promise<T> {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (requireAuth) {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Authentication required.')
    }
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? ((await response.json()) as T & ApiErrorPayload)
    : null

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(payload, `Request failed with status ${response.status}`))
  }

  return payload as T
}
