'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [testData, setTestData] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .limit(5);

      if (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
      } else {
        console.log('Supabase connected successfully!', data);
        setIsConnected(true);
        setTestData(data || []);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const insertTestData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: 'test_user_' + Date.now(),
          plan_id: 'free',
          status: 'active',
          keyword: 'TEST'
        })
        .select();

      if (error) {
        console.error('Insert error:', error);
        alert('Error inserting data: ' + error.message);
      } else {
        console.log('Data inserted successfully:', data);
        alert('Test data inserted successfully!');
        testConnection(); // Refresh data
      }
    } catch (error) {
      console.error('Insert failed:', error);
      alert('Failed to insert test data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Testing Supabase connection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Supabase Connection Test
          </h2>

          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
              isConnected ? 'bg-green-400 text-black' : 'bg-red-500 text-white'
            }`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? 'bg-black' : 'bg-white'
              }`}></div>
              {isConnected ? 'Connected Successfully!' : 'Connection Failed'}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test Connection Again
            </button>

            <button
              onClick={insertTestData}
              className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Insert Test Data
            </button>
          </div>

          {testData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Sample Data:</h3>
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-300 text-sm">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <a 
              href="/dashboard" 
              className="text-green-400 hover:text-green-300 underline"
            >
              Go to Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
