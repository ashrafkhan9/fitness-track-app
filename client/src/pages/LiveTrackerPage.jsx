import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { apiClient } from '../services/apiClient.js';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const LiveTrackerPage = () => {
  const [session, setSession] = useState(null);
  const [activityType, setActivityType] = useState('running');
  const [route, setRoute] = useState([]);
  const [remoteUpdates, setRemoteUpdates] = useState([]);
  const watchIdRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;
    socket.on('activity:remote-update', (payload) => {
      setRemoteUpdates((prev) => [...prev.slice(-10), payload]);
    });
    socket.on('activity:session-complete', (payload) => {
      setRemoteUpdates((prev) => [...prev.slice(-10), payload]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  }, []);

  const startTracking = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported on this device.');
      return;
    }

    const response = await apiClient.post('/workouts/live', { activityType });
    setSession(response.data);
    setRoute([]);
    watchIdRef.current = navigator.geolocation.watchPosition((position) => {
      const payload = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };
      setRoute((prev) => [...prev, payload]);
      socketRef.current?.emit('activity:update', { sessionId: response.data._id, point: payload });
      apiClient.post(`/workouts/live/${response.data._id}`, payload).catch((error) => {
        console.error('Failed to send live update', error);
      });
    }, (error) => console.error('Geolocation error', error), { enableHighAccuracy: true, maximumAge: 1000 });
  };

  const stopTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (session) {
      await apiClient.post(`/workouts/live/${session._id}/end`);
      setSession(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Live activity tracking</p>
            <p className="text-xs text-slate-500">Track distance and route in real time using your device GPS.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-xl border border-slate-200 px-3 py-2"
              value={activityType}
              onChange={(event) => setActivityType(event.target.value)}
            >
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
            </select>
            {!session ? (
              <button
                type="button"
                className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
                onClick={startTracking}
              >
                Start
              </button>
            ) : (
              <button
                type="button"
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-red-400"
                onClick={stopTracking}
              >
                Stop
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Your route</p>
            <div className="mt-3 space-y-2">
              {route.slice(-10).map((point, index) => (
                <div key={index} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                  <p>Lat: {point.latitude?.toFixed(4)} | Lng: {point.longitude?.toFixed(4)}</p>
                  <p className="text-xs text-slate-400">Speed: {point.speed?.toFixed(2) ?? '0'} m/s</p>
                </div>
              ))}
              {!route.length && <p>No live data yet. Start tracking to see updates.</p>}
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Community updates</p>
            <div className="mt-3 space-y-2">
              {remoteUpdates.slice(-10).map((update, index) => (
                <div key={index} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                  <p className="text-xs text-slate-400">Session {update.sessionId}</p>
                  {update.point ? (
                    <p>Lat: {update.point.latitude?.toFixed(4)} | Lng: {update.point.longitude?.toFixed(4)}</p>
                  ) : (
                    <p>Session completed</p>
                  )}
                </div>
              ))}
              {!remoteUpdates.length && <p>No remote updates yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackerPage;
