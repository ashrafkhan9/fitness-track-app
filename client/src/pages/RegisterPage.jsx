import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const RegisterPage = () => {
  const { register: registerField, handleSubmit } = useForm();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError('');
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        profile: {
          name: data.profileName || data.name,
          heightCm: Number(data.heightCm) || undefined,
          preferences: {
            weeklyGoalMinutes: Number(data.weeklyGoalMinutes) || undefined,
            calorieTarget: Number(data.calorieTarget) || undefined,
            stepTarget: Number(data.stepTarget) || undefined,
          },
        },
      };
      await registerUser(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to register');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="hidden w-1/2 bg-primary-600 p-12 md:block">
          <h1 className="text-3xl font-bold text-white">Join Fitness Tracker</h1>
          <p className="mt-4 text-primary-100">
            Set personalized goals, visualize your progress, and stay accountable with daily reminders.
          </p>
        </div>
        <div className="w-full p-8 md:w-1/2 md:p-12">
          <h2 className="text-2xl font-semibold text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Log in
            </Link>
          </p>

          <form className="mt-8 grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('name', { required: true })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('email', { required: true })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('password', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="profileName">
                Profile name
              </label>
              <input
                id="profileName"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="e.g., Me or Alex"
                {...registerField('profileName')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="heightCm">
                Height (cm)
              </label>
              <input
                id="heightCm"
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('heightCm')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="weeklyGoalMinutes">
                Weekly workout goal (minutes)
              </label>
              <input
                id="weeklyGoalMinutes"
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('weeklyGoalMinutes')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="calorieTarget">
                Daily calorie target
              </label>
              <input
                id="calorieTarget"
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('calorieTarget')}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="stepTarget">
                Daily step target
              </label>
              <input
                id="stepTarget"
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...registerField('stepTarget')}
              />
            </div>
            {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
