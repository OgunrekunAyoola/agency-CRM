// Use relative paths in the browser to leverage the Next.js proxy (next.config.ts)
// This avoids ERR_CONNECTION_REFUSED and CORS issues in the browser console.
const API_BASE_URL = (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, fetchOptions);

  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/me')) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, fetchOptions);
      } else {
        // Refresh failed, redirect to login if in browser and not already there
        if (typeof window !== 'undefined') {
          const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
          if (!isAuthPage) {
            window.location.href = '/login';
          }
        }
      }
    } catch (err) {
      console.error('Auto-refresh failed', err);
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        if (!isAuthPage) {
          window.location.href = '/login';
        }
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || errorData.Message || `API error: ${response.status}`;
    
    // Import toast dynamically to avoid server-side issues if api.ts is used in SSR
    const { toast } = await import("sonner");
    
    if (response.status >= 400 && response.status < 500 && response.status !== 401) {
      toast.error(message);
    } else if (response.status >= 500) {
      toast.error("A server error occurred. Please try again later.");
    }

    throw new Error(message);
  }


  const text = await response.text();
  return text ? JSON.parse(text) : {} as any;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
  patch: <T>(endpoint: string, body: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(body) 
    }),
  put: <T>(endpoint: string, body: unknown) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
  delete: <T = void>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};


