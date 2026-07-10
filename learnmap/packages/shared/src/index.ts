export type HealthResponse = {
  status: 'ok';
};

export type DbHealthResponse = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
};
