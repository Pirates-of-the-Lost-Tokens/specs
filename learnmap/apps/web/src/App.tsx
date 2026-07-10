import { useEffect, useState } from 'react';
import type { DbHealthResponse, HealthResponse } from '@learnmap/shared';
import { api } from './lib/api';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dbHealth, setDbHealth] = useState<DbHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [healthRes, dbRes] = await Promise.all([
          api.get<HealthResponse>('/health'),
          api.get<DbHealthResponse>('/health/db'),
        ]);
        setHealth(healthRes.data);
        setDbHealth(dbRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reach API');
      }
    }

    void load();
  }, []);

  return (
    <main className="app">
      <h1>LearnMap</h1>
      <p>Monorepo scaffold — UI + API + DB</p>

      {error && <p className="error">API error: {error}</p>}

      <section className="status">
        <div>
          <strong>API</strong>
          <span>{health?.status ?? '…'}</span>
        </div>
        <div>
          <strong>Database</strong>
          <span>{dbHealth?.database ?? '…'}</span>
        </div>
      </section>
    </main>
  );
}
