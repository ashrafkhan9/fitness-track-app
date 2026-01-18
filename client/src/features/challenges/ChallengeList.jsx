import PropTypes from 'prop-types';
import { useState } from 'react';

const ChallengeList = ({ challenges, onJoin, onProgress }) => {
  const [values, setValues] = useState({});

  const handleSubmit = (challengeId) => {
    const numeric = Number(values[challengeId]);
    if (Number.isNaN(numeric)) return;
    onProgress(challengeId, numeric);
    setValues((prev) => ({ ...prev, [challengeId]: '' }));
  };

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{challenge.title}</p>
              <p className="text-xs text-slate-500">{challenge.description}</p>
              <p className="text-xs text-slate-400">
                {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400">Participants</p>
              <p className="text-sm font-semibold text-slate-900">{challenge.participants.length}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
              onClick={() => onJoin(challenge._id)}
            >
              Join challenge
            </button>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Progress"
                className="w-32 rounded-xl border border-slate-200 px-3 py-2 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={values[challenge._id] ?? ''}
                onChange={(event) => setValues((prev) => ({ ...prev, [challenge._id]: event.target.value }))}
              />
              <button
                type="button"
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-500"
                onClick={() => handleSubmit(challenge._id)}
              >
                Update progress
              </button>
            </div>
          </div>
        </div>
      ))}
      {!challenges.length && <p className="text-sm text-slate-500">No challenges available.</p>}
    </div>
  );
};

ChallengeList.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.object).isRequired,
  })).isRequired,
  onJoin: PropTypes.func.isRequired,
  onProgress: PropTypes.func.isRequired,
};

export default ChallengeList;
