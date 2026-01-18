import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GoalForm from '../features/goals/GoalForm.jsx';
import GoalList from '../features/goals/GoalList.jsx';
import { apiClient } from '../services/apiClient.js';

const GoalsPage = () => {
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await apiClient.get('/goals');
      return response.data;
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (values) => apiClient.post('/goals', values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ goalId, value }) => apiClient.post(`/goals/${goalId}/progress`, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['workouts', 'suggestion'] });
    },
  });

  return (
    <div className="space-y-6">
      <GoalForm onSubmit={(values) => createGoalMutation.mutate(values)} />
      <GoalList
        goals={goals}
        onUpdateProgress={(goalId, value) => updateProgressMutation.mutate({ goalId, value })}
      />
    </div>
  );
};

export default GoalsPage;
