import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

const WorkoutForm = ({ onSubmit, profiles }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      type: 'running',
      intensity: 'moderate',
      durationMinutes: 30,
    },
  });

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      durationMinutes: Number(values.durationMinutes),
      caloriesBurned: values.caloriesBurned ? Number(values.caloriesBurned) : undefined,
      steps: values.steps ? Number(values.steps) : undefined,
      distanceKm: values.distanceKm ? Number(values.distanceKm) : undefined,
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="type">
          Workout type
        </label>
        <select
          id="type"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('type')}
        >
          <option value="running">Running</option>
          <option value="walking">Walking</option>
          <option value="cycling">Cycling</option>
          <option value="strength">Strength</option>
          <option value="yoga">Yoga</option>
          <option value="hiit">HIIT</option>
          <option value="swimming">Swimming</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="durationMinutes">
          Duration (minutes)
        </label>
        <input
          id="durationMinutes"
          type="number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('durationMinutes')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="caloriesBurned">
          Calories (optional)
        </label>
        <input
          id="caloriesBurned"
          type="number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('caloriesBurned')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="steps">
          Steps (optional)
        </label>
        <input
          id="steps"
          type="number"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('steps')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="distanceKm">
          Distance (km)
        </label>
        <input
          id="distanceKm"
          type="number"
          step="0.01"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('distanceKm')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="intensity">
          Intensity
        </label>
        <select
          id="intensity"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('intensity')}
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </div>

      {profiles?.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="profileId">
            Profile
          </label>
          <select
            id="profileId"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            {...register('profileId')}
          >
            {profiles.map((profile) => (
              <option key={profile._id} value={profile._id}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          {...register('notes')}
        />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
        >
          Log workout
        </button>
      </div>
    </form>
  );
};

WorkoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
};

export default WorkoutForm;
