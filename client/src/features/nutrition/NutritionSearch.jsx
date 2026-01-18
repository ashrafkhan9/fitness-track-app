
import { useState } from 'react';
import PropTypes from 'prop-types';

const NutritionSearch = ({ onSearch, results, onSelect }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    await onSearch(query);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search foods (e.g., grilled chicken, banana)"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
        >
          Search
        </button>
      </form>
      <div className="mt-4 grid gap-3">
        {results?.map((food) => (
          <button
            key={`${food.food_name}-${food.nf_calories}`}
            type="button"
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left hover:border-primary-200"
            onClick={() => onSelect(food)}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 capitalize">{food.food_name}</p>
              <p className="text-xs text-slate-500">
                {Math.round(food.nf_calories)} kcal · {Math.round(food.nf_protein ?? 0)}g protein · {Math.round(food.nf_total_carbohydrate ?? 0)}g carbs
              </p>
            </div>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
              Add
            </span>
          </button>
        ))}
        {!results?.length && (
          <p className="text-sm text-slate-500">Search for foods to log their nutrition.</p>
        )}
      </div>
    </div>
  );
};

NutritionSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    food_name: PropTypes.string,
    nf_calories: PropTypes.number,
    nf_protein: PropTypes.number,
    nf_total_carbohydrate: PropTypes.number,
  })),
  onSelect: PropTypes.func.isRequired,
};

export default NutritionSearch;
