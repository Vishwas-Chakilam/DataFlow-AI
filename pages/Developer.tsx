import React from 'react';
import { Github, Linkedin, Mail, Code } from 'lucide-react';

const Developer: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-slide-up">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
               <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                 VC
               </div>
               {/* Replace with actual image if available: <img src="url" className="rounded-full" /> */}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vishwas Chakilam</h1>
          <p className="text-apple-blue font-medium mb-6">Senior Frontend React Engineer & AI Enthusiast</p>
          
          <div className="space-y-4 mb-8">
             <p className="text-gray-600 leading-relaxed">
               Passionate about building intuitive, high-performance web applications that bridge the gap between complex AI technologies and everyday users. 
               DataFlow AI is a testament to the power of modern web technologies combined with generative AI.
             </p>
          </div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Connect</h3>
          <div className="grid gap-3">
             <a href="mailto:work.vishwas1@gmail.com" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">
               <Mail className="w-5 h-5 mr-3" /> work.vishwas1@gmail.com
             </a>
             <a href="https://github.com/vishwas-chakilam" target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">
               <Github className="w-5 h-5 mr-3" /> github.com/vishwas-chakilam
             </a>
             <a href="https://linkedin.com/in/vishwas-chakilam" target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">
               <Linkedin className="w-5 h-5 mr-3" /> linkedin.com/in/vishwas-chakilam
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
