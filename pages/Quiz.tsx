import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: number;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setShowScore(false);
    setScore(0);
    setCurrentQuestion(0);
    const data = await generateQuizQuestions();
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
      } else {
        // Fallback questions if API fails or returns bad format
        setQuestions([
          { question: "What is Supervised Learning?", options: ["Learning with labeled data", "Learning with no data", "Learning with unlabeled data"], answer: 0 },
          { question: "Which algorithm is used for Classification?", options: ["Linear Regression", "K-Means", "Logistic Regression"], answer: 2 },
          { question: "What is Overfitting?", options: ["Model is too simple", "Model learns noise in training data", "Model performs well on test data"], answer: 1 }
        ]);
      }
    } catch (e) {
      console.error("Failed to parse quiz", e);
    }
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setShowScore(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mb-4"></div>
         <p className="text-gray-500">Generating AI Questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {showScore ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-xl shadow-gray-200 border border-gray-100 animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <Brain size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 mb-8">
            You scored <span className="font-bold text-black">{score}</span> out of {questions.length}
          </p>
          <button 
            onClick={loadQuestions}
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 flex items-center justify-center mx-auto"
          >
            <RefreshCw className="mr-2 w-4 h-4" /> Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200 border border-gray-100 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 bg-gray-100 w-full">
            <div 
              className="h-full bg-apple-blue transition-all duration-500" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-6 mt-4">
            <span className="text-xs font-bold text-apple-blue tracking-wider uppercase">Question {currentQuestion + 1}/{questions.length}</span>
            <h2 className="text-2xl font-bold mt-2 text-gray-900 leading-snug">{questions[currentQuestion].question}</h2>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-apple-blue hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
