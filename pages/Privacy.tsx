import React from 'react';
import { Lock, Eye, Database, Server } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-blue-50 rounded-2xl mb-6 text-apple-blue">
           <Lock size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Your privacy is our priority.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12 space-y-12">
          
          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
                 <Eye size={24} />
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h3>
               <p className="text-gray-600 leading-relaxed">
                 We collect information you provide directly to us, such as when you create an account, upload datasets, or communicate with us. This includes:
                 <br/><br/>
                 • Account Information (Name, Email)<br/>
                 • User Content (Uploaded CSV/Excel files)<br/>
                 • Usage Data (How you interact with our tools)
               </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
                 <Database size={24} />
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Data</h3>
               <p className="text-gray-600 leading-relaxed">
                 Your datasets are used solely for the purpose of generating insights, training models, and providing the DataFlow AI service. 
                 <br/><br/>
                 <strong>We do not sell your data.</strong> We may use aggregated, anonymized data to improve our machine learning algorithms.
               </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
                 <Server size={24} />
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Data Security</h3>
               <p className="text-gray-600 leading-relaxed">
                 We implement industry-standard security measures to protect your personal information and datasets. 
                 However, no method of transmission over the Internet is 100% secure.
               </p>
            </div>
          </div>

        </div>
        
        <div className="bg-gray-50 p-8 md:p-12 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Questions?</h3>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at <a href="/contact" className="text-apple-blue font-medium hover:underline">work.vishwas1@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;