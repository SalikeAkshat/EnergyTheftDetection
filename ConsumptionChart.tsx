import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { User } from '../types';

interface ConsumptionChartProps {
  data: User[];
  isLoading?: boolean;
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data, isLoading = false }) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  // Process data for the chart
  const processData = () => {
    // Create an array of consumption data points for the chart
    const sortedUsers = [...data].sort((a, b) => a.id - b.id);
    return sortedUsers.map(user => ({
      id: user.id,
      consumption: user.avgConsumption,
      status: user.potentialTheft ? 'Potential Theft' : 'Normal',
      fill: user.potentialTheft ? '#EF4444' : '#3B82F6',
    }));
  };

  const chartData = data.length > 0 ? processData() : [];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Consumption Analysis</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Line
          </button>
          <button 
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
              chartType === 'area' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Area
          </button>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="id" 
                label={{ value: 'User ID', position: 'insideBottomRight', offset: -10 }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                label={{ value: 'Avg. Consumption (kWh)', angle: -90, position: 'insideLeft' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ 
                  stroke: user => user.status === 'Potential Theft' ? '#EF4444' : '#3B82F6',
                  strokeWidth: 2,
                  r: user => user.status === 'Potential Theft' ? 6 : 4,
                  fill: user => user.status === 'Potential Theft' ? '#FEE2E2' : '#DBEAFE'
                }}
                activeDot={{ r: 8 }}
                name="Consumption"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="id" 
                label={{ value: 'User ID', position: 'insideBottomRight', offset: -10 }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                label={{ value: 'Avg. Consumption (kWh)', angle: -90, position: 'insideLeft' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stackId="1"
                stroke="#3B82F6" 
                fill={`url(#colorGradient)`}
                name="Consumption"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-6">Potential Theft</span>
        
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        <span className="text-sm text-gray-600 dark:text-gray-400">Normal Consumption</span>
      </div>
    </div>
  );
};

export default ConsumptionChart;