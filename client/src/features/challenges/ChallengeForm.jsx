import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const ChallengeForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      metric: 'steps',
      target: 50000,
      isPublic: true,
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      target: Number(values.target),
      startDate: values.startDate || new Date().toISOString(),
      endDate: values.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Challenge title
        </label>
        <input
          id="title"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="e.g., 7-day step sprint"
          {...register('title', { required: true })}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={2}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('description')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="metric">
          Metric
        </label>
        <select
          id="metric"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('metric')}
        >
          <option value="steps">Steps</option>
          <option value="calories">Calories</option>
          <option value="duration">Duration</option>
          <option value="workouts">Workouts</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="target">
          Target
        </label>
        <input
          id="target"
          type="number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('target', { required: true })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="startDate">
          Start date
        </label>
        <input
          id="startDate"
          type="date"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('startDate')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="endDate">
          End date
        </label>
        <input
          id="endDate"
          type="date"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('endDate')}
        />
      </div>
      <div className="md:col-span-2 flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" {...register('isPublic')} />
          Public challenge
        </label>
        <button
          type="submit"
          className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
        >
          Create challenge
        </button>
      </div>
    </form>
  );
};

ChallengeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ChallengeForm;
