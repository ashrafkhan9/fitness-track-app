import PropTypes from 'prop-types';

const NutritionLogList = ({ entries }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Food</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Meal</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Calories</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Macros</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {entries.map((entry) => (
          <tr key={entry._id}>
            <td className="px-4 py-3 text-sm text-slate-600">
              {new Date(entry.consumedAt).toLocaleString()}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-slate-900">{entry.foodName}</td>
            <td className="px-4 py-3 text-sm text-slate-600 capitalize">{entry.mealType}</td>
            <td className="px-4 py-3 text-sm text-slate-600">{Math.round(entry.calories ?? 0)}</td>
            <td className="px-4 py-3 text-xs text-slate-500">
              P: {Math.round(entry.protein ?? 0)}g · C: {Math.round(entry.carbs ?? 0)}g · F: {Math.round(entry.fat ?? 0)}g
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!entries.length && <p className="px-6 py-8 text-center text-sm text-slate-500">No meals logged yet.</p>}
  </div>
);

NutritionLogList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    foodName: PropTypes.string,
    mealType: PropTypes.string,
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbs: PropTypes.number,
    fat: PropTypes.number,
    consumedAt: PropTypes.string,
  })).isRequired,
};

export default NutritionLogList;
