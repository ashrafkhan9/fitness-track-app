const getSuggestionFromMetrics = ({ recentWorkouts = [], goals = [] }) => {
  const latestWorkout = recentWorkouts[0];
  const activeGoal = goals.find((goal) => !goal.isCompleted);

  if (activeGoal?.category === 'steps') {
    return {
      title: 'Power Walk',
      description: '30-minute brisk walk to help you close the gap toward your step goal.',
      durationMinutes: 30,
      intensity: 'moderate',
    };
  }

  if (activeGoal?.category === 'calories') {
    return {
      title: 'HIIT Session',
      description: '20-minute high intensity interval training session targeting 250 calories.',
      durationMinutes: 20,
      intensity: 'high',
    };
  }

  if (!latestWorkout) {
    return {
      title: 'Starter Yoga Flow',
      description: 'Gentle 15-minute yoga routine to get you moving.',
      durationMinutes: 15,
      intensity: 'low',
    };
  }

  switch (latestWorkout.type) {
    case 'running':
      return {
        title: 'Interval Run',
        description: 'Alternate between 2 minutes fast and 2 minutes easy for 20 minutes.',
        durationMinutes: 20,
        intensity: 'high',
      };
    case 'strength':
    case 'weightlifting':
      return {
        title: 'Full-Body Strength Circuit',
        description: '3 rounds of compound movements focusing on balance and core strength.',
        durationMinutes: 30,
        intensity: 'moderate',
      };
    default:
      return {
        title: 'Low Impact Cardio',
        description: '25-minute cycling or elliptical session to keep your momentum going.',
        durationMinutes: 25,
        intensity: 'moderate',
      };
  }
};

module.exports = {
  getSuggestionFromMetrics,
};
