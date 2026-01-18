import { useState } from 'react';
import { apiClient } from '../services/apiClient.js';
import { useAuth } from '../hooks/useAuth.js';

const initialProfileForm = { name: '', heightCm: '', stepTarget: '' };
const baseConnection = { provider: 'fitbit', externalUserId: '', accessToken: '' };

const ProfilesPage = () => {
  const { profiles, refreshProfiles } = useAuth();
  const [form, setForm] = useState(initialProfileForm);
  const [weights, setWeights] = useState({});
  const [connections, setConnections] = useState({});
  const [syncMessage, setSyncMessage] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();
    await apiClient.post('/profiles', {
      name: form.name,
      heightCm: Number(form.heightCm) || undefined,
      preferences: {
        stepTarget: Number(form.stepTarget) || undefined,
      },
    });
    setForm(initialProfileForm);
    await refreshProfiles();
  };

  const handleWeightLog = async (profileId) => {
    const value = weights[profileId];
    if (!value) return;
    await apiClient.post(`/profiles/${profileId}/weight`, {
      value: Number(value),
      unit: 'kg',
      recordedAt: new Date().toISOString(),
    });
    setWeights((prev) => ({ ...prev, [profileId]: '' }));
    await refreshProfiles();
  };

  const handleAddConnection = async (profileId) => {
    const payload = connections[profileId] ?? { ...baseConnection };
    await apiClient.post(`/wearables/${profileId}`, payload);
    setConnections((prev) => ({ ...prev, [profileId]: { ...baseConnection } }));
    await refreshProfiles();
  };

  const handleSyncConnection = async (profileId, connectionId) => {
    const response = await apiClient.post(`/wearables/${profileId}/${connectionId}/sync`);
    const { steps, caloriesOut, distance, source } = response.data;
    setSyncMessage(`Synced ${source ?? 'device'}: ${steps ?? 0} steps, ${caloriesOut ?? 0} calories, ${distance ?? 0} km.`);
  };

  const getConnectionState = (profileId) => connections[profileId] ?? { ...baseConnection };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="profileName">
            Profile name
          </label>
          <input
            id="profileName"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="profileHeight">
            Height (cm)
          </label>
          <input
            id="profileHeight"
            type="number"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            value={form.heightCm}
            onChange={(event) => setForm((prev) => ({ ...prev, heightCm: event.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="profileSteps">
            Daily step target
          </label>
          <input
            id="profileSteps"
            type="number"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            value={form.stepTarget}
            onChange={(event) => setForm((prev) => ({ ...prev, stepTarget: event.target.value }))}
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button type="submit" className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500">
            Add profile
          </button>
        </div>
      </form>

      {syncMessage && <p className="text-sm text-primary-600">{syncMessage}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {profiles?.map((profile) => {
          const connectionState = getConnectionState(profile._id);
          return (
            <div key={profile._id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-500">Height: {profile.heightCm ?? '-'} cm</p>
                <p className="text-xs text-slate-500">Step target: {profile.preferences?.stepTarget ?? '-'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
                  value={weights[profile._id] ?? ''}
                  onChange={(event) => setWeights((prev) => ({ ...prev, [profile._id]: event.target.value }))}
                />
                <button
                  type="button"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => handleWeightLog(profile._id)}
                >
                  Log weight
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-500">
                {profile.weightHistory?.slice(-3).reverse().map((entry, index) => (
                  <p key={index}>
                    {new Date(entry.recordedAt).toLocaleDateString()} - {entry.value} {entry.unit}
                  </p>
                ))}
                {!profile.weightHistory?.length && <p>No weight history yet.</p>}
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="text-sm font-semibold text-slate-700">Wearable connections</p>
                <div className="mt-3 space-y-2">
                  {profile.wearableConnections?.map((connection) => (
                    <div key={connection._id} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                      <p className="text-xs uppercase text-slate-400">{connection.provider}</p>
                      <p className="text-xs text-slate-500">External ID: {connection.externalUserId ?? '-'}</p>
                      <button
                        type="button"
                        className="mt-2 rounded-lg border border-primary-200 px-3 py-1 text-xs font-semibold text-primary-600"
                        onClick={() => handleSyncConnection(profile._id, connection._id)}
                      >
                        Sync now
                      </button>
                    </div>
                  ))}
                  {!profile.wearableConnections?.length && <p className="text-xs text-slate-500">No devices linked.</p>}
                </div>

                <div className="mt-4 space-y-2">
                  <select
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={connectionState.provider}
                    onChange={(event) => setConnections((prev) => ({
                      ...prev,
                      [profile._id]: {
                        ...(prev[profile._id] ?? { ...baseConnection }),
                        provider: event.target.value,
                      },
                    }))}
                  >
                    <option value="fitbit">Fitbit</option>
                    <option value="apple">Apple</option>
                    <option value="google-fit">Google Fit</option>
                    <option value="strava">Strava</option>
                  </select>
                  <input
                    type="text"
                    placeholder="External user ID"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={connectionState.externalUserId}
                    onChange={(event) => setConnections((prev) => ({
                      ...prev,
                      [profile._id]: {
                        ...(prev[profile._id] ?? { ...baseConnection }),
                        externalUserId: event.target.value,
                      },
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Access token"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={connectionState.accessToken}
                    onChange={(event) => setConnections((prev) => ({
                      ...prev,
                      [profile._id]: {
                        ...(prev[profile._id] ?? { ...baseConnection }),
                        accessToken: event.target.value,
                      },
                    }))}
                  />
                  <button
                    type="button"
                    className="w-full rounded-xl border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-600"
                    onClick={() => handleAddConnection(profile._id)}
                  >
                    Link wearable
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilesPage;
