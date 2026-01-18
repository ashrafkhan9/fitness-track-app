import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/StatCard.jsx';
import LineChartCard from '../components/LineChartCard.jsx';
import GoalProgressCard from '../components/GoalProgressCard.jsx';
import SuggestionCard from '../components/SuggestionCard.jsx';
import { apiClient } from '../services/apiClient.js';

const DashboardPage = () => {
  const { data: workoutStats } = useQuery({
    queryKey: ['workouts', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/workouts/stats');
      return response.data;
    },
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await apiClient.get('/goals');
      return response.data;
    },
  });

  const { data: weightMetrics } = useQuery({
    queryKey: ['health', 'weight'],
    queryFn: async () => {
      const response = await apiClient.get('/health-metrics', {
        params: { metric: 'weight', limit: 10 },
      });
      return response.data;
    },
  });

  const { data: suggestion } = useQuery({
    queryKey: ['workouts', 'suggestion'],
    queryFn: async () => {
      const response = await apiClient.get('/workouts/suggestions');
      return response.data;
    },
  });

  const { data: challenges } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const response = await apiClient.get('/challenges');
      return response.data;
    },
  });

  const weightChartData = useMemo(() => {
    if (!weightMetrics) return [];
    return weightMetrics.slice().reverse().map((metric) => ({
      label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(metric.recordedAt)),
      weight: metric.value,
    }));
  }, [weightMetrics]);

  const achievements = useMemo(() => {
    if (!workoutStats) return [];
    const items = [];
    if ((workoutStats.totalDuration ?? 0) >= 150) {
      items.push('Great job: you reached 150 minutes of training this week.');
    }
    if ((workoutStats.totalSteps ?? 0) >= 70000) {
      items.push('Step star: you walked more than 70k steps this week.');
    }
    if ((workoutStats.totalCalories ?? 0) >= 3500) {
      items.push('Calorie crusher: over 3500 calories burned.');
    }
    return items;
  }, [workoutStats]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Minutes exercised" value={workoutStats?.totalDuration ?? 0} subtitle="Last 7 days" />
        <StatCard title="Calories burned" value={workoutStats?.totalCalories ?? 0} subtitle="Last 7 days" />
        <StatCard title="Steps" value={workoutStats?.totalSteps ?? 0} subtitle="Last 7 days" />
        <StatCard title="Active goals" value={goals?.filter((goal) => !goal.isCompleted).length ?? 0} subtitle="Keep pushing!" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <LineChartCard title="Weight trend" data={weightChartData} dataKey="weight" />
        {suggestion && <SuggestionCard suggestion={suggestion} />}
      </section>

      {achievements.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Achievements</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {achievements.map((achievement, index) => (
              <li key={index} className="rounded-xl bg-slate-50 px-4 py-2">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.slice(0, 3).map((goal) => (
          <GoalProgressCard key={goal._id} goal={goal} />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Ongoing challenges</p>
        </div>
        <div className="mt-4 space-y-3">
          {challenges?.slice(0, 4).map((challenge) => (
            <div key={challenge._id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{challenge.title}</p>
                <p className="text-xs text-slate-500">
                  {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-slate-400">Participants</p>
                <p className="text-sm font-semibold text-slate-900">{challenge.participants.length}</p>
              </div>
            </div>
          ))}
          {!challenges?.length && (
            <p className="text-sm text-slate-500">No active challenges yet. Join one to stay motivated!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
