import PropTypes from 'prop-types';

const GoalProgressCard = ({ goal }) => {
  const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">{goal.title}</p>
      <p className="mt-2 text-xs uppercase text-slate-400">{goal.category}</p>
      <div className="mt-4">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-slate-900">{percent}%</p>
          <p className="text-sm text-slate-500">
            {goal.currentValue}/{goal.targetValue} {goal.unit}
          </p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

GoalProgressCard.propTypes = {
  goal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    currentValue: PropTypes.number.isRequired,
    targetValue: PropTypes.number.isRequired,
    unit: PropTypes.string,
  }).isRequired,
};

export default GoalProgressCard;
