import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import HealthMetricForm from '../features/health/HealthMetricForm.jsx';
import LineChartCard from '../components/LineChartCard.jsx';
import { apiClient } from '../services/apiClient.js';

const metricColors = {
  sleep: '#0ea5e9',
  water: '#14b8a6',
  'blood-pressure': '#a855f7',
  'heart-rate': '#ef4444',
  weight: '#6366f1',
  custom: '#0b78ff',
};

const HealthPage = () => {
  const queryClient = useQueryClient();

  const { data: dashboard = [] } = useQuery({
    queryKey: ['health', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/health-metrics/dashboard');
      return response.data;
    },
  });

  const logMetricMutation = useMutation({
    mutationFn: (payload) => apiClient.post('/health-metrics', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['health', 'dashboard'] }),
  });

  const chartData = useMemo(() => dashboard.map((metric) => ({
    id: metric._id,
    data: metric.history.slice(-12).map((entry) => ({
      label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(entry.recordedAt)),
      value: entry.value,
    })),
  })), [dashboard]);

  return (
    <div className="space-y-6">
      <HealthMetricForm onSubmit={(values) => logMetricMutation.mutate(values)} />
      <div className="grid gap-4 lg:grid-cols-2">
        {chartData.map((metric) => (
          <LineChartCard
            key={metric.id}
            title={metric.id.replace('-', ' ')}
            data={metric.data}
            dataKey="value"
            color={metricColors[metric.id] || '#0b78ff'}
          />
        ))}
        {!chartData.length && <p className="text-sm text-slate-500">Log metrics to see trends here.</p>}
      </div>
    </div>
  );
};

export default HealthPage;
