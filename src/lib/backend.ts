const BACKEND_PROXY_BASE = '/api/backend';

export type BackendOverview = {
  status: string;
  environment: string;
  database_url: string;
  auth0_configured: boolean;
  mojo: {
    binary_path: string;
    exists: boolean;
    executable: boolean;
    status: string;
  };
  queue: {
    broker: string;
    result_backend: string;
  };
};

export type BackendReasoningResponse = {
  chain_of_thought: string[];
  confidence_score: number;
  action_taken: string;
  analysis_status?: string;
  engine?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export async function fetchBackend<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T | null }> {
  const response = await fetch(`${BACKEND_PROXY_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    cache: 'no-store',
    ...init,
  });

  if (!response.ok) {
    return { ok: false, status: response.status, data: null };
  }

  return {
    ok: true,
    status: response.status,
    data: await parseResponse<T>(response),
  };
}
