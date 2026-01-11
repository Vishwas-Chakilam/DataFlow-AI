import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Calendar, Edit2, Settings, CreditCard, Activity, Box, Clock, Shield } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  // Mock additional user data since backend is manual for now
  const joinDate = "October 2023";
  const stats = [
    { label: "Models Built", value: "12", icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Predictions", value: "1,240", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Compute Hours", value: "48h", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
  ];

  const activities = [
    { action: "Trained 'Customer Churn' model", time: "2 hours ago", type: "model" },
    { action: "Uploaded 'sales_data_2023.csv'", time: "5 hours ago", type: "upload" },
    { action: "Ran prediction on 'Housing Prices'", time: "1 day ago", type: "predict" },
    { action: "Updated profile settings", time: "3 days ago", type: "settings" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200 border border-gray-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-[100px] -z-10 opacity-50"></div>
        
        <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-gray-800 text-4xl font-bold uppercase select-none">
                     {user.username.slice(0, 2) || 'US'}
                </div>
            </div>
            <div className="absolute bottom-0 right-0 p-2.5 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-white">
                <Edit2 size={16} />
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-3 pt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-500">Data Scientist • Free Tier</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Mail size={14} className="mr-2 text-gray-400" /> {user.email}
                </span>
                <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar size={14} className="mr-2 text-gray-400" /> Member since {joinDate}
                </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase">
                  Pro Plan
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wide uppercase">
                  <Shield size={12} className="mr-1" /> Verified
                </span>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}>
                    <stat.icon size={28} />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity size={24} className="mr-3 text-orange-500" /> Activity Log
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-8 relative pl-2">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100"></div>

                {activities.map((act, i) => (
                    <div key={i} className="relative pl-10 group">
                        <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                           <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500 group-hover:scale-125 transition-transform shadow-sm z-10"></div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-blue-50 transition-colors border border-gray-100 group-hover:border-blue-100">
                           <p className="text-gray-900 font-semibold text-sm">{act.action}</p>
                           <p className="text-gray-400 text-xs mt-1 font-medium">{act.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Settings / Preferences */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Settings size={24} className="mr-3 text-gray-600" /> Settings
              </h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="flex items-center">
                         <Mail size={18} className="text-gray-400 mr-3 group-hover:text-gray-600" />
                         <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                      </div>
                      <div className="w-11 h-6 bg-green-500 rounded-full relative transition-colors shadow-inner">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="flex items-center">
                         <Shield size={18} className="text-gray-400 mr-3 group-hover:text-gray-600" />
                         <span className="text-sm font-medium text-gray-700">Two-Factor Auth</span>
                      </div>
                      <div className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors shadow-inner">
                           <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                  </div>

                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                          <CreditCard size={18} className="mr-3 text-gray-400 group-hover:text-gray-600" /> Billing & Plan
                      </span>
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md group-hover:bg-blue-100 transition-colors">Manage</span>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                <Box size={120} />
             </div>
             <h3 className="text-lg font-bold mb-2">Upgrade to Enterprise</h3>
             <p className="text-gray-400 text-sm mb-6 max-w-xs">Get unlimited model training, API access, and dedicated support.</p>
             <button className="w-full py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg">
                View Plans
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;