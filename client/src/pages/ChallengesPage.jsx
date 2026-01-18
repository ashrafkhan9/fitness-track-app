import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ChallengeForm from '../features/challenges/ChallengeForm.jsx';
import ChallengeList from '../features/challenges/ChallengeList.jsx';
import { apiClient } from '../services/apiClient.js';
import { useAuth } from '../hooks/useAuth.js';

const ChallengesPage = () => {
  const queryClient = useQueryClient();
  const { profiles } = useAuth();
  const [leaderboard, setLeaderboard] = useState(null);

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const response = await apiClient.get('/challenges');
      return response.data;
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: (payload) => apiClient.post('/challenges', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  });

  const joinChallengeMutation = useMutation({
    mutationFn: (challengeId) => apiClient.post(`/challenges/${challengeId}/join`, {
      profileId: profiles?.[0]?._id,
    }),
    onSuccess: (_, challengeId) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      fetchLeaderboard(challengeId);
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ challengeId, value }) => apiClient.post(`/challenges/${challengeId}/progress`, {
      profileId: profiles?.[0]?._id,
      progress: value,
    }),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      fetchLeaderboard(challengeId);
    },
  });

  const fetchLeaderboard = async (challengeId) => {
    const response = await apiClient.get(`/challenges/${challengeId}/leaderboard`);
    setLeaderboard(response.data);
  };

  return (
    <div className="space-y-6">
      <ChallengeForm onSubmit={(values) => createChallengeMutation.mutate(values)} />
      <ChallengeList
        challenges={challenges}
        onJoin={(challengeId) => joinChallengeMutation.mutate(challengeId)}
        onProgress={(challengeId, value) => updateProgressMutation.mutate({ challengeId, value })}
      />
      {leaderboard && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Leaderboard — {leaderboard.challenge}</p>
          <div className="mt-4 space-y-2">
            {leaderboard.leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">#{entry.rank} {entry.user}</span>
                <span className="text-sm text-slate-500">{entry.progress}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
