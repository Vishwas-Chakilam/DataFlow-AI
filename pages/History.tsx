import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, FileText, Clock, Loader } from 'lucide-react';
import { historyAPI } from '../services/api';

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await historyAPI.getAll();
      setHistoryItems(response.history || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadModel = async (sessionId: number) => {
    try {
      const session = await historyAPI.load(sessionId);
      // Navigate to dashboard with session data
      // For now, just show alert
      alert(`Loaded session: ${session.session_name}`);
    } catch (err: any) {
      alert(`Failed to load session: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 animate-fade-in">
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-purple-600 w-8 h-8" />
          <span className="ml-3 text-gray-600">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fade-in">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-purple-100 rounded-xl mr-4 text-purple-600">
           <HistoryIcon size={24} />
        </div>
        <h1 className="text-3xl font-bold">Model History</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {historyItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
          <FileText className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No History Yet</h3>
          <p className="text-gray-500">Your trained models and sessions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between">
               <div className="flex items-start space-x-4 mb-4 md:mb-0">
                 <div className="p-2 bg-gray-50 rounded-lg">
                   <FileText className="text-gray-400" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-gray-900">{item.model_name || item.session_name || 'Untitled Model'}</h3>
                   <p className="text-sm text-gray-500 flex items-center mt-1">
                     <Clock size={14} className="mr-1" /> 
                     {new Date(item.created_at).toLocaleDateString()} • {item.model_type || 'Model'}
                     {item.dataset_name && ` • ${item.dataset_name}`}
                   </p>
                 </div>
               </div>
               
               <div className="flex items-center space-x-6">
                  {item.accuracy && (
                    <div className="text-right">
                      <span className="block text-xs text-gray-400 uppercase">Accuracy</span>
                      <span className="font-bold text-green-600 text-lg">{typeof item.accuracy === 'number' ? item.accuracy.toFixed(1) + '%' : item.accuracy}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => handleLoadModel(item.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Load Model
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;