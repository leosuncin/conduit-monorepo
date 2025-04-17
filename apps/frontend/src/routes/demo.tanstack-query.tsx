import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
});

export interface HealthCheck {
  stats: Stats;
  healthChecks: HealthChecks;
  info: Info;
}

export interface HealthChecks {
  database: string;
}

export interface Info {
  description: string;
  environment: string;
  name: string;
  version: string;
}

export interface Stats {
  creationTime: Date;
  uptime: number;
  memory: Memory;
}

export interface Memory {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

function TanStackQueryDemo() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('/api/health')
        .then((res) => res.json())
        .then((d) => d as HealthCheck),
    initialData: {} as unknown as HealthCheck,
    refetchInterval: 500,
  });

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl">Health Check</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
