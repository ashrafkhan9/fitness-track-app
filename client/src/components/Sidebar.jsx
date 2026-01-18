import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  HeartIcon,
  HomeIcon,
  MapIcon,
  Squares2X2Icon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/workouts', label: 'Workouts', icon: ClipboardDocumentListIcon },
  { to: '/goals', label: 'Goals', icon: FlagIcon },
  { to: '/nutrition', label: 'Nutrition', icon: ChartBarIcon },
  { to: '/challenges', label: 'Challenges', icon: Squares2X2Icon },
  { to: '/live-tracker', label: 'Live Tracker', icon: MapIcon },
  { to: '/health', label: 'Health', icon: HeartIcon },
  { to: '/profiles', label: 'Profiles', icon: UsersIcon },
  { to: '/settings', label: 'Settings', icon: WrenchScrewdriverIcon },
];

const Sidebar = () => (
  <aside className="flex h-full flex-col border-r border-slate-200 bg-white/70 backdrop-blur">
    <div className="flex items-center gap-2 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white font-semibold">
        FT
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">Fitness Tracker</p>
        <p className="text-sm text-slate-500">Your wellness hub</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 px-4">
      {navLinks.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary-100 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
    <p className="px-4 pb-6 text-xs text-slate-400">&copy; {new Date().getFullYear()} Fitness Tracker</p>
  </aside>
);

export default Sidebar;
