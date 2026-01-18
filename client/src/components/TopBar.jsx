import { useMemo } from 'react';
import { BellIcon, MicrophoneIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useVoiceCommands } from '../hooks/useVoiceCommands.js';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const commands = useMemo(() => ([
    { phrase: 'open workouts', action: () => navigate('/workouts') },
    { phrase: 'start live tracking', action: () => navigate('/live-tracker') },
    { phrase: 'show goals', action: () => navigate('/goals') },
    { phrase: 'log workout', action: () => navigate('/workouts') },
  ]), [navigate]);

  const { listening, supported, start } = useVoiceCommands(commands);

  const handleShare = async () => {
    const shareData = {
      title: 'My Fitness Progress',
      text: 'Tracking my fitness journey with the Fitness Tracker app!',
      url: window.location.origin,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      // eslint-disable-next-line no-alert
      alert('Share link copied to clipboard');
    }
  };

  const titleMap = {
    '/': 'Dashboard',
    '/workouts': 'Workouts',
    '/goals': 'Goals',
    '/nutrition': 'Nutrition',
    '/challenges': 'Challenges',
    '/live-tracker': 'Live Tracker',
    '/health': 'Health Metrics',
    '/profiles': 'Profiles',
    '/settings': 'Settings',
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-6 backdrop-blur">
      <div>
        <p className="text-lg font-semibold text-slate-900">
          {titleMap[location.pathname] || 'Fitness Tracker'}
        </p>
        <p className="text-sm text-slate-500">Stay on track with your wellness goals.</p>
      </div>
      <div className="flex items-center gap-3">
        {supported && (
          <button
            type="button"
            onClick={start}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${listening ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-600'}`}
          >
            <MicrophoneIcon className="h-4 w-4" />
            {listening ? 'Listening…' : 'Voice'}
          </button>
        )}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-primary-200 hover:text-primary-600"
        >
          <ShareIcon className="h-4 w-4" />
          Share
        </button>
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 hover:border-primary-200 hover:text-primary-600"
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
            {user?.name?.slice(0, 1).toUpperCase() ?? 'U'}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <button
              type="button"
              className="text-xs text-primary-600 hover:underline"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
