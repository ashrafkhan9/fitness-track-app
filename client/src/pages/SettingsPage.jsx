import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient.js';
import { requestNotificationToken, listenForForegroundMessages } from '../services/firebase.js';
import { useAuth } from '../hooks/useAuth.js';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [settings, setSettings] = useState(user?.notificationSettings ?? {});
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSettings(user?.notificationSettings ?? {});
  }, [user]);

  useEffect(() => {
    const unsubscribe = listenForForegroundMessages?.((payload) => {
      setMessage(`Notification: ${payload.notification?.title}`);
    });
    return () => {
      unsubscribe?.();
    };
  }, []);

  const saveSettings = async () => {
    const response = await apiClient.patch('/notifications/settings', settings);
    setSettings(response.data);
    setUser((prev) => ({ ...prev, notificationSettings: response.data }));
    setMessage('Notification preferences updated');
  };

  const registerPush = async () => {
    try {
      const token = await requestNotificationToken();
      if (!token) {
        setMessage('Firebase is not configured');
        return;
      }
      await apiClient.post('/notifications/push-token', { token });
      setMessage('Push notifications enabled');
    } catch (error) {
      setMessage(error.message || 'Failed to enable notifications');
    }
  };

  const sendTest = async () => {
    await apiClient.post('/notifications/test');
    setMessage('Test notification sent');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Notification preferences</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={settings?.emailReminders ?? false}
              onChange={(event) => setSettings((prev) => ({ ...prev, emailReminders: event.target.checked }))}
            />
            Email reminders
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={settings?.pushReminders ?? false}
              onChange={(event) => setSettings((prev) => ({ ...prev, pushReminders: event.target.checked }))}
            />
            Push notifications
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              className="w-24 rounded-xl border border-slate-200 px-3 py-2"
              value={settings?.reminderWindow?.startHour ?? 7}
              onChange={(event) => setSettings((prev) => ({
                ...prev,
                reminderWindow: {
                  ...prev?.reminderWindow,
                  startHour: Number(event.target.value),
                  endHour: prev?.reminderWindow?.endHour ?? 21,
                },
              }))}
            />
            <input
              type="number"
              className="w-24 rounded-xl border border-slate-200 px-3 py-2"
              value={settings?.reminderWindow?.endHour ?? 21}
              onChange={(event) => setSettings((prev) => ({
                ...prev,
                reminderWindow: {
                  ...prev?.reminderWindow,
                  startHour: prev?.reminderWindow?.startHour ?? 7,
                  endHour: Number(event.target.value),
                },
              }))}
            />
            <input
              type="text"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Timezone e.g. UTC"
              value={settings?.timezone ?? 'UTC'}
              onChange={(event) => setSettings((prev) => ({ ...prev, timezone: event.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white" onClick={registerPush}>
              Enable push
            </button>
            <button type="button" className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600" onClick={saveSettings}>
              Save
            </button>
            <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600" onClick={sendTest}>
              Send test
            </button>
          </div>
          {message && <p className="text-xs text-primary-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
