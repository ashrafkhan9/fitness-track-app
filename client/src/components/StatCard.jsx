import PropTypes from 'prop-types';

const StatCard = ({ title, value, subtitle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
};

export default StatCard;
