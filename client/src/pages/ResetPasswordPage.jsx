import { useForm } from 'react-hook-form';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../services/apiClient.js';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setError('');
      await apiClient.post('/auth/reset-password', { token, password: data.password });
      setMessage('Password updated. You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Reset failed.');
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow">
          <p className="text-sm text-slate-600">Reset token missing.</p>
          <Link to="/login" className="mt-3 inline-block text-sm text-primary-600">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-8">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-slate-900">Reset password</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5"
                {...register('password', { required: true })}
              />
            </div>
            {message && <p className="text-sm text-primary-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
