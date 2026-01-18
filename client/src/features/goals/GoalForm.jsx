import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

const GoalForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      category: 'steps',
      unit: 'count',
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      targetValue: Number(values.targetValue),
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3"
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Goal title
        </label>
        <input
          id="title"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          placeholder="e.g., Burn 2000 calories this week"
          {...register('title', { required: true })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('category')}
        >
          <option value="steps">Steps</option>
          <option value="calories">Calories</option>
          <option value="duration">Duration</option>
          <option value="weight">Weight</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="targetValue">
          Target value
        </label>
        <input
          id="targetValue"
          type="number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('targetValue', { required: true })}
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
        <label className="block text-sm font-medium text-slate-700" htmlFor="dueDate">
          Due date
        </label>
        <input
          id="dueDate"
          type="date"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('dueDate')}
        />
      </div>

      <div className="md:col-span-3 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
        >
          Add goal
        </button>
      </div>
    </form>
  );
};

GoalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default GoalForm;
