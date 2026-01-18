import PropTypes from 'prop-types';

const SuggestionCard = ({ suggestion }) => (
  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-sm">
    <p className="text-sm uppercase tracking-wide text-primary-100">Recommended Workout</p>
    <h3 className="mt-2 text-2xl font-semibold">{suggestion.title}</h3>
    <p className="mt-2 text-sm text-primary-100">{suggestion.description}</p>
    <div className="mt-4 flex gap-4 text-sm text-primary-50">
      <span>Duration: {suggestion.durationMinutes} min</span>
      <span>Intensity: {suggestion.intensity}</span>
    </div>
  </div>
);

SuggestionCard.propTypes = {
  suggestion: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    durationMinutes: PropTypes.number.isRequired,
    intensity: PropTypes.string.isRequired,
  }).isRequired,
};

export default SuggestionCard;
