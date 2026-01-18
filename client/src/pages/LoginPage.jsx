import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../services/apiClient.js';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const { register: registerField, handleSubmit, getValues } = useForm();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to log in');
    }
  };

  const handlePasswordReset = async (email) => {
    if (!email) {
      setError('Enter your email to receive a reset link.');
      return;
    }
    try {
      await apiClient.post('/auth/request-password-reset', { email });
      setMessage('If the email exists, we will send a reset link.');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to request reset.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row">
        <div className="relative hidden w-1/2 items-center justify-center bg-primary-600 p-12 md:flex">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
            <p className="mt-4 text-primary-100">
              Log workouts, track goals, and stay motivated with personalized recommendations.
            </p>
          </div>
        </div>
        <div className="w-full p-8 md:w-1/2 md:p-12">
          <h2 className="text-2xl font-semibold text-slate-900">Log in</h2>
          <p className="mt-2 text-sm text-slate-500">
            New here?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Create an account
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
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

            <div>
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

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-primary-600">{message}</p>}

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-primary-600 hover:underline"
                onClick={() => handlePasswordReset(getValues('email'))}
              >
                Forgot password?
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
