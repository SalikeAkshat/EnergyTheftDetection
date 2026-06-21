import React from 'react';
import { Users, ZapOff, BarChart, Shield } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  percentChange?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, percentChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="font-bold text-2xl text-gray-900 dark:text-white mt-1">{value}</h3>
          
          {percentChange !== undefined && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-xs font-medium ${
                  percentChange >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {percentChange >= 0 ? '+' : ''}{percentChange}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  stats: DashboardStatsType;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full w-12 h-12"></div>
              <div className="ml-5 w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users className="h-6 w-6 text-white" />}
        color="bg-blue-500"
        percentChange={5.2}
      />
      <StatCard
        title="Potential Thieves"
        value={stats.potentialThieves}
        icon={<ZapOff className="h-6 w-6 text-white" />}
        color="bg-red-500"
        percentChange={-3.1}
      />
      <StatCard
        title="Avg. Consumption (kWh)"
        value={stats.averageConsumption.toFixed(1)}
        icon={<BarChart className="h-6 w-6 text-white" />}
        color="bg-yellow-500"
        percentChange={1.8}
      />
      <StatCard
        title="Detection Accuracy"
        value={`${stats.detectionAccuracy}%`}
        icon={<Shield className="h-6 w-6 text-white" />}
        color="bg-green-500"
      />
    </div>
  );
};

export default DashboardStats;