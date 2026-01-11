import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { ArrowRight, Brain, Zap, Layers, BarChart, FileSpreadsheet, Check, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-16 pb-24 text-center md:pt-32 md:pb-32">
        <div className="animate-fade-in flex flex-col items-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/5 border border-gray-900/10 text-gray-600 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
              <span>Powered by Gemini 2.0 Flash</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-gray-900 mb-6 leading-[1.1]">
              Data science.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                Democratized.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              Transform raw CSVs into powerful predictive models without writing a single line of code.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate(user.isLoggedIn ? AppRoute.DASHBOARD : AppRoute.SIGNUP)}
                className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-black transition-all hover:scale-105 shadow-xl shadow-gray-200 flex items-center justify-center"
              >
                Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate(AppRoute.QUIZ)}
                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Take the Quiz
              </button>
            </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100 mb-20">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Everything you need.</h2>
            <p className="text-xl text-gray-500">From raw data to deployed API endpoint in minutes.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Large */}
            <div className="md:col-span-2 bg-gray-50 rounded-[2rem] p-10 flex flex-col justify-between h-[400px] relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                      <Brain size={24} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">AutoML Engine</h3>
                   <p className="text-gray-500 max-w-sm">We automatically select the best algorithm (Random Forest, SVM, Regression) for your specific dataset.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-blue-200 to-transparent opacity-50 rounded-tl-full translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-900 text-white rounded-[2rem] p-10 flex flex-col justify-between h-[400px] relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white mb-6">
                      <Zap size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Instant Cleaning</h3>
                   <p className="text-gray-400">Missing values? Duplicates? Bias? We handle the messy work instantly.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500 blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
            </div>

            {/* Card 3 */}
             <div className="bg-white border border-gray-200 rounded-[2rem] p-10 flex flex-col justify-between h-[400px] relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                      <FileSpreadsheet size={24} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Any Format</h3>
                   <p className="text-gray-500">Support for CSV, Excel, and JSON. Just drag and drop.</p>
                </div>
            </div>

             {/* Card 4 - Large */}
             <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] p-10 flex flex-col justify-between h-[400px] relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                      <BarChart size={24} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Deep Insights</h3>
                   <p className="text-gray-500 max-w-sm">Our AI doesn't just predict; it explains. Get visual breakdowns of feature importance and correlations.</p>
                </div>
                {/* Abstract Chart visualization */}
                 <div className="absolute right-8 bottom-8 flex items-end space-x-2 opacity-50">
                    <div className="w-8 h-16 bg-purple-300 rounded-t-lg"></div>
                    <div className="w-8 h-24 bg-purple-400 rounded-t-lg"></div>
                    <div className="w-8 h-32 bg-purple-500 rounded-t-lg"></div>
                    <div className="w-8 h-20 bg-purple-300 rounded-t-lg"></div>
                 </div>
            </div>
         </div>
      </section>

      {/* Value Proposition / Steps */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 tracking-tight">How it works.</h2>
         
         <div className="space-y-32">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">1</div>
                  <h3 className="text-3xl font-bold text-gray-900">Upload your raw data.</h3>
                  <p className="text-xl text-gray-500 leading-relaxed">
                     Don't worry about formatting. Whether it's sales figures, customer logs, or sensor data, simply drag and drop your file. We parse it securely in the browser.
                  </p>
                  <ul className="space-y-3 pt-4">
                     {['Automatic Type Detection', 'Secure Client-Side Parsing', 'Instant Preview'].map(item => (
                        <li key={item} className="flex items-center text-gray-700 font-medium">
                           <Check className="text-green-500 mr-3 w-5 h-5" /> {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="flex-1 bg-gray-100 rounded-3xl h-[400px] w-full flex items-center justify-center shadow-inner">
                   {/* Abstract representation of a file upload */}
                   <FileSpreadsheet size={120} className="text-gray-300" />
               </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">2</div>
                  <h3 className="text-3xl font-bold text-gray-900">AI builds the pipeline.</h3>
                  <p className="text-xl text-gray-500 leading-relaxed">
                     DataFlow AI analyzes your columns, handles missing data, encodes categories, and selects the perfect machine learning model for your goal.
                  </p>
               </div>
               <div className="flex-1 bg-blue-50 rounded-3xl h-[400px] w-full flex items-center justify-center shadow-inner relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                   </div>
                   <Brain size={120} className="text-blue-500 relative z-10" />
               </div>
            </div>

             {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl">3</div>
                  <h3 className="text-3xl font-bold text-gray-900">Predict the future.</h3>
                  <p className="text-xl text-gray-500 leading-relaxed">
                     Use your trained model to make real-time predictions. Enter new data points and get instant results with confidence scores.
                  </p>
               </div>
               <div className="flex-1 bg-purple-50 rounded-3xl h-[400px] w-full flex items-center justify-center shadow-inner">
                   <TrendingUp size={120} className="text-purple-500" />
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24">
         <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black z-0"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
               <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to find the patterns?</h2>
               <p className="text-xl text-gray-400">Join thousands of data enthusiasts using DataFlow AI to make better decisions.</p>
               <button 
                  onClick={() => navigate(AppRoute.SIGNUP)}
                  className="px-10 py-5 bg-white text-black rounded-full text-xl font-bold hover:bg-gray-200 transition-colors inline-flex items-center"
               >
                  Get Started for Free <ArrowRight className="ml-2" />
               </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;