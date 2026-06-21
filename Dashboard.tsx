import React, { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import ConsumptionChart from './ConsumptionChart';
import TheftDetectionTable from './TheftDetectionTable';
import UserDetailChart from './UserDetailChart';
import FileUpload from './FileUpload';
import { fetchMockUsers, fetchMockDashboardStats } from '../utils/mockData';
import { User, DashboardStats as DashboardStatsType } from '../types';
import { User as UserIcon, UploadCloud, RefreshCcw, X } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        fetchMockUsers(),
        fetchMockDashboardStats()
      ]);
      
      setUsers(usersData);
      setStats(statsData);
      
      // Select a random theft user for the detailed view
      const thieves = usersData.filter(user => user.potentialTheft);
      if (thieves.length > 0) {
        setSelectedUser(thieves[Math.floor(Math.random() * thieves.length)]);
      } else {
        setSelectedUser(usersData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleUserSelection = (user: User) => {
    setSelectedUser(user);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      // Validate CSV structure
      if (!headers.includes('UserId') || !headers.includes('IsStealer')) {
        throw new Error('Invalid CSV format. Required columns: UserId, IsStealer');
      }

      // Process the data (in a real app, this would be handled by the backend)
      console.log('Processing CSV data:', rows.length, 'rows');
      
      // Close the modal after successful upload
      setShowUploadModal(false);
      
      // Refresh the data
      loadData();
    } catch (error) {
      console.error('Error processing CSV:', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Theft Detection Dashboard</h1>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Data
          </button>
          
          <button 
            onClick={loadData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full shadow-xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Upload Energy Consumption Data
                </h2>
                <FileUpload onFileUpload={handleFileUpload} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      {stats && <DashboardStats stats={stats} isLoading={isLoading} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Consumption Chart */}
          <ConsumptionChart data={users} isLoading={isLoading} />
          
          {/* Users Table */}
          <div className="mt-8">
            <TheftDetectionTable 
              users={users} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        <div>
          {/* User Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all duration-200">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <UserIcon className="h-5 w-5 inline-block mr-2" />
              Selected User
            </h2>
            
            <select
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-150"
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const userId = parseInt(e.target.value);
                const user = users.find(u => u.id === userId);
                if (user) {
                  setSelectedUser(user);
                }
              }}
              disabled={isLoading}
            >
              <option value="" disabled>Select a user</option>
              <optgroup label="Potential Theft">
                {users
                  .filter(user => user.potentialTheft)
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      User #{user.id} - {user.avgConsumption.toFixed(1)} kWh
                    </option>
                  ))
                }
              </optgroup>
              <optgroup label="Normal Users">
                {users
                  .filter(user => !user.potentialTheft)
                  .slice(0, 10) // Limit to avoid too many options
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      User #{user.id} - {user.avgConsumption.toFixed(1)} kWh
                    </option>
                  ))
                }
              </optgroup>
            </select>
          </div>
          
          {/* User Detail Chart */}
          {selectedUser && (
            <UserDetailChart user={selectedUser} />
          )}
          
          {/* Detection Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8 transition-all duration-200">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About Detection Model
            </h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Our ML model uses gradient boosting regression and KMeans clustering to identify abnormal consumption patterns.
              </p>
              <p>
                The model analyzes historical consumption data to establish baselines and detect anomalies that may indicate energy theft.
              </p>
              <p>
                Current model accuracy: <span className="font-semibold text-green-600 dark:text-green-400">{stats?.detectionAccuracy}%</span>
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Detection Criteria:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prediction error above threshold</li>
                  <li>Unusual consumption patterns</li>
                  <li>Cluster analysis outliers</li>
                  <li>Historical data comparison</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;