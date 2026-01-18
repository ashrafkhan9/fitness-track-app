import PropTypes from 'prop-types';

const WorkoutList = ({ workouts }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Date
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Type
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Duration
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Calories
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Steps
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {workouts.map((workout) => (
          <tr key={workout._id}>
            <td className="px-4 py-3 text-sm text-slate-600">
              {new Date(workout.startTime).toLocaleString()}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-slate-900">{workout.type}</td>
            <td className="px-4 py-3 text-sm text-slate-600">{workout.durationMinutes} min</td>
            <td className="px-4 py-3 text-sm text-slate-600">{workout.caloriesBurned ?? '—'}</td>
            <td className="px-4 py-3 text-sm text-slate-600">{workout.steps ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {!workouts.length && (
      <p className="px-6 py-8 text-center text-sm text-slate-500">
        No workouts yet. Log your first workout to get started!
      </p>
    )}
  </div>
);

WorkoutList.propTypes = {
  workouts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.string,
    durationMinutes: PropTypes.number,
    caloriesBurned: PropTypes.number,
    steps: PropTypes.number,
    startTime: PropTypes.string,
  })).isRequired,
};

export default WorkoutList;
