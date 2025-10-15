'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export default function DebugSupabase() {
  const { user, isLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    if (!isLoaded || !user) {
      setDebugInfo('User not loaded or not signed in');
      return;
    }

    setIsLoading(true);
    let info = '';

    try {
      // Test 1: Basic connection
      info += `Testing Supabase connection...\n`;
      info += `User ID: ${user.id}\n`;
      info += `Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n\n`;

      // Test 2: Check if table exists
      info += `Testing table access...\n`;
      const { data: tableData, error: tableError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .limit(1);

      if (tableError) {
        info += `Table Error: ${tableError.message}\n`;
        info += `Error Code: ${tableError.code}\n`;
        info += `Error Details: ${JSON.stringify(tableError, null, 2)}\n\n`;
      } else {
        info += `Table access successful!\n`;
        info += `Sample data: ${JSON.stringify(tableData, null, 2)}\n\n`;
      }

      // Test 3: Try to insert test data
      info += `Testing insert operation...\n`;
      const testData = {
        user_id: user.id,
        plan_id: 'free',
        status: 'active',
        tradingview_username: 'test_user_' + Date.now()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert(testData)
        .select();

      if (insertError) {
        info += `Insert Error: ${insertError.message}\n`;
        info += `Error Code: ${insertError.code}\n`;
        info += `Error Details: ${JSON.stringify(insertError, null, 2)}\n\n`;
      } else {
        info += `Insert successful!\n`;
        info += `Inserted data: ${JSON.stringify(insertData, null, 2)}\n\n`;

        // Clean up test data
        if (insertData && insertData[0]) {
          await supabase
            .from('user_subscriptions')
            .delete()
            .eq('id', insertData[0].id);
          info += `Test data cleaned up.\n`;
        }
      }

      // Test 4: Check user's existing data
      info += `Checking existing user data...\n`;
      const { data: userData, error: userError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (userError) {
        info += `User Data Error: ${userError.message}\n`;
      } else {
        info += `User Data: ${JSON.stringify(userData, null, 2)}\n`;
      }

    } catch (error) {
      info += `Unexpected Error: ${error}\n`;
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  const testUpdate = async () => {
    if (!isLoaded || !user) {
      setDebugInfo('User not loaded or not signed in');
      return;
    }

    setIsLoading(true);
    let info = '';

    try {
      // First, get existing subscription
      const { data: existingData, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        info += `Fetch Error: ${fetchError.message}\n`;
        info += `Error Code: ${fetchError.code}\n`;
      } else {
        info += `Existing Data: ${JSON.stringify(existingData, null, 2)}\n`;

        // Try to update
        const { data: updateData, error: updateError } = await supabase
          .from('user_subscriptions')
          .update({ 
            tradingview_username: 'updated_test_' + Date.now()
          })
          .eq('id', existingData.id)
          .select();

        if (updateError) {
          info += `Update Error: ${updateError.message}\n`;
          info += `Error Code: ${updateError.code}\n`;
        } else {
          info += `Update successful!\n`;
          info += `Updated data: ${JSON.stringify(updateData, null, 2)}\n`;
        }
      }
    } catch (error) {
      info += `Unexpected Error: ${error}\n`;
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Please sign in</div>;
  }

  return (
    <div className="min-h-screen bg-black py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Supabase Debug Tool</h1>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Test Connection & Insert
            </button>
            
            <button
              onClick={testUpdate}
              disabled={isLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 ml-4"
            >
              Test Update
            </button>
          </div>

          {debugInfo && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Debug Information:</h3>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
