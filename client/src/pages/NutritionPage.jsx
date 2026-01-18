import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NutritionSearch from '../features/nutrition/NutritionSearch.jsx';
import NutritionLogList from '../features/nutrition/NutritionLogList.jsx';
import BarcodeScanner from '../features/nutrition/BarcodeScanner.jsx';
import LineChartCard from '../components/LineChartCard.jsx';
import { apiClient } from '../services/apiClient.js';

const NutritionPage = () => {
  const queryClient = useQueryClient();
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const { data: logs = [] } = useQuery({
    queryKey: ['nutrition'],
    queryFn: async () => {
      const response = await apiClient.get('/nutrition');
      return response.data;
    },
  });

  const logMutation = useMutation({
    mutationFn: (payload) => apiClient.post('/nutrition', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      setMessage('Meal logged successfully.');
    },
  });

  const handleSearch = async (query) => {
    const response = await apiClient.post('/nutrition/search', { query });
    setSearchResults(response.data.foods ?? []);
  };

  const handleSelect = (food) => {
    logMutation.mutate({
      foodName: food.food_name,
      calories: food.nf_calories,
      protein: food.nf_protein,
      carbs: food.nf_total_carbohydrate,
      fat: food.nf_total_fat,
      mealType: 'other',
    });
  };

  const handleBarcodeDetected = async (barcode) => {
    const response = await apiClient.get(`/nutrition/barcode/${barcode}`);
    const food = response.data.foods?.[0];
    if (food) {
      handleSelect(food);
    }
  };

  const calorieChartData = useMemo(() => {
    const byDate = logs.reduce((acc, entry) => {
      const dateKey = new Date(entry.consumedAt).toISOString().slice(0, 10);
      acc[dateKey] = (acc[dateKey] ?? 0) + (entry.calories ?? 0);
      return acc;
    }, {});

    return Object.entries(byDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, calories]) => ({
        label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date)),
        calories: Math.round(calories),
      }));
  }, [logs]);

  return (
    <div className="space-y-6">
      <NutritionSearch onSearch={handleSearch} results={searchResults} onSelect={handleSelect} />
      {message && <p className="text-sm text-primary-600">{message}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard title="Calories by day" data={calorieChartData} dataKey="calories" color="#f97316" />
        <BarcodeScanner onDetected={handleBarcodeDetected} />
      </div>
      <NutritionLogList entries={logs} />
    </div>
  );
};

export default NutritionPage;
