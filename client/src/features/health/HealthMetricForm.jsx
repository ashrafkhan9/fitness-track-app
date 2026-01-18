import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const HealthMetricForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      metric: 'sleep',
      unit: 'hours',
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      value: Number(values.value),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="metric">
          Metric
        </label>
        <select
          id="metric"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('metric')}
        >
          <option value="sleep">Sleep duration</option>
          <option value="water">Water intake</option>
          <option value="blood-pressure">Blood pressure</option>
          <option value="heart-rate">Heart rate</option>
          <option value="weight">Weight</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="value">
          Value
        </label>
        <input
          id="value"
          type="number"
          step="0.1"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('value', { required: true })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="unit">
          Unit
        </label>
        <input
          id="unit"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('unit')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="recordedAt">
          Date
        </label>
        <input
          id="recordedAt"
          type="datetime-local"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('recordedAt')}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="note">
          Note (optional)
        </label>
        <textarea
          id="note"
          rows={2}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('note')}
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
        >
          Log metric
        </button>
      </div>
    </form>
  );
};

HealthMetricForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default HealthMetricForm;
