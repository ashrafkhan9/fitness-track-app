import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import WorkoutForm from '../features/workouts/WorkoutForm.jsx';
import WorkoutList from '../features/workouts/WorkoutList.jsx';
import LineChartCard from '../components/LineChartCard.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { apiClient } from '../services/apiClient.js';

const WorkoutsPage = () => {
  const queryClient = useQueryClient();
  const { profiles } = useAuth();

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await apiClient.get('/workouts');
      return response.data;
    },
  });

  const logWorkoutMutation = useMutation({
    mutationFn: (values) => apiClient.post('/workouts', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workouts', 'stats'] });
    },
  });

  const distanceChartData = useMemo(() => workouts.slice(0, 8).reverse().map((workout) => ({
    label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(workout.startTime)),
    distance: workout.distanceKm ?? 0,
  })), [workouts]);

  return (
    <div className="space-y-6">
      <WorkoutForm
        profiles={profiles}
        onSubmit={(values) => logWorkoutMutation.mutate(values)}
      />

      <LineChartCard
        title="Distance over time"
        data={distanceChartData}
        dataKey="distance"
        color="#0b78ff"
      />

      <WorkoutList workouts={workouts} />
    </div>
  );
};

export default WorkoutsPage;
