import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import WorkoutsPage from '../pages/WorkoutsPage.jsx';
import GoalsPage from '../pages/GoalsPage.jsx';
import NutritionPage from '../pages/NutritionPage.jsx';
import ChallengesPage from '../pages/ChallengesPage.jsx';
import LiveTrackerPage from '../pages/LiveTrackerPage.jsx';
import HealthPage from '../pages/HealthPage.jsx';
import ProfilesPage from '../pages/ProfilesPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import AppLayout from '../components/AppLayout.jsx';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/live-tracker" element={<LiveTrackerPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;
