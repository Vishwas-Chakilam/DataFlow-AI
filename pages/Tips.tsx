import React from 'react';
import { Brain, Database, Network, Cpu, Lightbulb, BookOpen, ArrowRight, Layers } from 'lucide-react';

const Tips: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in pb-24">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs tracking-wider uppercase mb-2">
          <BookOpen size={14} className="mr-2" /> Learning Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Demystifying <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Intelligence</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Understanding the world of AI doesn't have to be complicated. 
          Here is your guide to the concepts shaping our future.
        </p>
      </div>

      {/* The Big 4 Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          {
            title: "Data Science",
            icon: Database,
            color: "text-green-600",
            bg: "bg-green-50",
            desc: "The art of uncovering insights from raw data using statistics and visualization."
          },
          {
            title: "Machine Learning",
            icon: Cpu,
            color: "text-blue-600",
            bg: "bg-blue-50",
            desc: "Teaching computers to learn from patterns without being explicitly programmed."
          },
          {
            title: "Deep Learning",
            icon: Network,
            color: "text-purple-600",
            bg: "bg-purple-50",
            desc: "A subset of ML inspired by the human brain (neural networks) to solve complex problems."
          },
          {
            title: "Artificial Intelligence",
            icon: Brain,
            color: "text-orange-600",
            bg: "bg-orange-50",
            desc: "The broad science of mimicking human abilities like reasoning, seeing, and creating."
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100 hover:-translate-y-1 transition-transform duration-300">
             <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
               <item.icon size={28} />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
             <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Deep Dives */}
      <div className="space-y-16">
        {/* Machine Learning Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-100 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Cpu className="mr-4 text-blue-600" /> Machine Learning
               </h2>
               <p className="text-gray-600 text-lg leading-relaxed">
                 Machine Learning (ML) is like teaching a child by example. Instead of writing strict rules (if x then y), we feed the computer data (examples) and it figures out the rules itself.
               </p>
               
               <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">The Three Main Types:</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                          <h4 className="font-bold text-gray-900 mb-1">Supervised</h4>
                          <p className="text-xs text-gray-500">Learning with labeled data (e.g., teaching a cat vs dog using named photos).</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                          <h4 className="font-bold text-gray-900 mb-1">Unsupervised</h4>
                          <p className="text-xs text-gray-500">Finding hidden patterns in unlabeled data (e.g., grouping customers by behavior).</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                          <h4 className="font-bold text-gray-900 mb-1">Reinforcement</h4>
                          <p className="text-xs text-gray-500">Learning by trial and error (e.g., a robot learning to walk).</p>
                      </div>
                  </div>
               </div>
            </div>
        </div>

        {/* Deep Learning Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl text-white flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl font-bold flex items-center">
                  <Network className="mr-4 text-purple-400" /> Deep Learning
               </h2>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Deep Learning powers the most magical AI moments today—like self-driving cars, face recognition, and ChatGPT. It uses "Neural Networks," layers of math that mimic how neurons fire in the human brain.
               </p>
               <ul className="space-y-3 pt-2">
                 {[
                   "Requires vast amounts of data to work well.",
                   "Uses 'layers' to understand data hierarchy (edges -> shapes -> faces).",
                   "Powers Generative AI (creating images, text, code)."
                 ].map((point, i) => (
                   <li key={i} className="flex items-start text-gray-300">
                     <div className="min-w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{i + 1}</div>
                     {point}
                   </li>
                 ))}
               </ul>
            </div>
            <div className="w-full md:w-1/3 flex justify-center opacity-80">
                <Layers size={180} className="text-purple-500/50" />
            </div>
        </div>

        {/* Learning Tips */}
        <div className="space-y-8">
            <div className="text-center">
               <h2 className="text-3xl font-bold text-gray-900">How to Start Learning?</h2>
               <p className="text-gray-500 mt-2">You don't need a PhD to get started. Follow these steps.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 mb-4 font-bold">1</div>
                    <h3 className="font-bold text-xl mb-2">Learn Python</h3>
                    <p className="text-gray-500 text-sm">Python is the language of AI. It's readable, powerful, and has libraries like Pandas and Scikit-Learn that do the heavy lifting.</p>
                </div>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-4 font-bold">2</div>
                    <h3 className="font-bold text-xl mb-2">Understand the Basics</h3>
                    <p className="text-gray-500 text-sm">Don't rush to code. Understand core statistics: Mean, Median, Standard Deviation, and basic Probability.</p>
                </div>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-700 mb-4 font-bold">3</div>
                    <h3 className="font-bold text-xl mb-2">Projects & Theory</h3>
                    <p className="text-gray-500 text-sm">The best way to learn is by doing. Download a dataset from Kaggle or use DataFlow AI to play with real data.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="mt-20 text-center bg-blue-50 rounded-[2.5rem] p-12">
         <Lightbulb size={48} className="mx-auto text-blue-600 mb-6" />
         <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experiment?</h2>
         <p className="text-gray-600 mb-8 max-w-lg mx-auto">
           Apply what you've learned. Upload a dataset to DataFlow AI and watch Machine Learning in action.
         </p>
         <a href="#/dashboard" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
         </a>
      </div>
    </div>
  );
};

export default Tips;