import PropTypes from 'prop-types';
import { useState } from 'react';

const GoalList = ({ goals, onUpdateProgress }) => {
  const [values, setValues] = useState({});

  const handleProgressChange = (goalId, value) => {
    setValues((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleSubmit = (goalId) => {
    const numeric = Number(values[goalId]);
    if (Number.isNaN(numeric)) return;
    onUpdateProgress(goalId, numeric);
    setValues((prev) => ({ ...prev, [goalId]: '' }));
  };

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
        return (
          <div key={goal._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                <p className="text-xs uppercase text-slate-400">{goal.category}</p>
              </div>
              <div className="text-sm text-slate-500">
                Progress: {goal.currentValue}/{goal.targetValue} {goal.unit}
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-primary-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <input
                type="number"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 md:w-auto"
                placeholder="Update progress"
                value={values[goal._id] ?? ''}
                onChange={(event) => handleProgressChange(goal._id, event.target.value)}
              />
              <button
                type="button"
                className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
                onClick={() => handleSubmit(goal._id)}
              >
                Log progress
              </button>
            </div>
          </div>
        );
      })}
      {!goals.length && (
        <p className="text-sm text-slate-500">No goals yet. Create one to stay accountable.</p>
      )}
    </div>
  );
};

GoalList.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    currentValue: PropTypes.number.isRequired,
    targetValue: PropTypes.number.isRequired,
    unit: PropTypes.string,
    category: PropTypes.string,
  })).isRequired,
  onUpdateProgress: PropTypes.func.isRequired,
};

export default GoalList;
