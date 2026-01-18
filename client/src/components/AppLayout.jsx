import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

const AppLayout = () => (
  <div className="flex min-h-screen bg-slate-100">
    <div className="hidden w-64 md:block">
      <Sidebar />
    </div>
    <div className="flex min-h-screen flex-1 flex-col">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
