import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { User } from '../types';

interface UserDetailChartProps {
  user: User;
}

const UserDetailChart: React.FC<UserDetailChartProps> = ({ user }) => {
  // Format the consumption history for the chart
  const chartData = user.consumptionHistory.map((value, index) => ({
    day: index + 1,
    consumption: value,
  }));

  // Calculate the average line
  const avgValue = user.avgConsumption;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Consumption History - User #{user.id}
      </h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']}
              labelFormatter={(label: number) => `Day ${label}`}
            />
            
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ 
                stroke: '#3B82F6',
                r: 3,
                strokeWidth: 1,
              }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            
            {/* Average consumption reference line */}
            <Line 
              type="monotone" 
              data={[
                { day: 1, average: avgValue },
                { day: chartData.length, average: avgValue }
              ]}
              dataKey="average"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Daily Consumption</span>
        </div>
        
        <div className="flex items-center">
          <span className="inline-block w-5 h-1 bg-red-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Average ({avgValue.toFixed(1)} kWh)</span>
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className={`text-sm font-semibold ${
              user.potentialTheft 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {user.potentialTheft ? 'Potential Theft' : 'Normal'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prediction Error</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.predictionError?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cluster</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.cluster}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Monthly</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.totalConsumption.toFixed(1)} kWh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailChart;