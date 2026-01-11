import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Play, Cpu, BarChart2, Download, RefreshCw, AlertCircle, TrendingUp, Brain, Zap, Layers } from 'lucide-react';
import { Dataset, MLModel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { datasetAPI, processingAPI, modelAPI, visualizationAPI } from '../services/api';

const steps = [
  'Upload Data',
  'Gathering & Cleaning',
  'Transformation',
  'Modeling',
  'Training',
  'Prediction & Results'
];

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [splitRatio, setSplitRatio] = useState(70);
  const [trainedModel, setTrainedModel] = useState<MLModel | null>(null);
  const [trainedModelId, setTrainedModelId] = useState<number | null>(null);
  
  // Prediction State
  const [predictionInputs, setPredictionInputs] = useState<Record<string, string>>({});
  const [predictionResult, setPredictionResult] = useState<string>('');
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);

  // Get chart data from visualization API
  const loadVisualization = async () => {
    if (!datasetId) return;
    try {
      const viz = await visualizationAPI.generate(datasetId);
      if (viz.data && viz.data.data) {
        setChartData(viz.data.data);
      }
    } catch (err) {
      console.error('Failed to load visualization:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setDataset(null);
    setDatasetId(null);

    if (!file) return;

    // File Extension Validation
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError("Invalid file format. Please upload a CSV or Excel file.");
      e.target.value = '';
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await datasetAPI.upload(file);
      const datasetData = response.dataset;
      
      setDataset({
        name: datasetData.name,
        headers: datasetData.headers,
        data: datasetData.data || [],
        rowCount: datasetData.row_count
      });
      setDatasetId(datasetData.id);
    } catch (err: any) {
      setError(err.message || "Failed to upload dataset. Please try again.");
      setDataset(null);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const processStep1_Gathering = async () => {
    if (!datasetId) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await processingAPI.gathering(datasetId);
      setInsights(response.insights || 'Data gathering completed successfully.');
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to process data gathering.");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadModelSuggestions = async () => {
    if (!datasetId) return;
    try {
      const response = await modelAPI.suggest(datasetId);
      setAvailableModels(response.suggestions || ['Random Forest', 'Linear Regression', 'Decision Tree', 'K-Nearest Neighbors', 'SVM']);
    } catch (err) {
      console.error('Failed to load model suggestions:', err);
      setAvailableModels(['Random Forest', 'Linear Regression', 'Decision Tree', 'K-Nearest Neighbors', 'SVM']);
    }
  };

  useEffect(() => {
    if (currentStep === 2 && datasetId) {
      loadModelSuggestions();
    }
  }, [currentStep, datasetId]);

  const startTraining = async () => {
    if (!datasetId || selectedModels.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await modelAPI.train(datasetId, selectedModels, splitRatio);
      if (response.models && response.models.length > 0) {
        const bestModel = response.models[0];
        setTrainedModel({
          id: bestModel.id.toString(),
          name: bestModel.model_name,
          type: bestModel.model_type as 'Regression' | 'Classification',
          accuracy: `${bestModel.accuracy?.toFixed(1)}%`,
          status: 'trained',
          description: bestModel.description || `Trained ${bestModel.model_name}`,
          createdAt: new Date().toISOString()
        });
        setTrainedModelId(bestModel.id);
        loadVisualization();
        setCurrentStep(5);
      }
    } catch (err: any) {
      setError(err.message || "Failed to train models.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-start training when step 4 is reached
  const [trainingStarted, setTrainingStarted] = useState(false);
  useEffect(() => {
    if (currentStep === 4 && !isProcessing && !trainingStarted && datasetId && selectedModels.length > 0) {
      setTrainingStarted(true);
      startTraining();
    }
    if (currentStep !== 4) {
      setTrainingStarted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handlePredict = async () => {
    if (!trainedModelId) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await modelAPI.predict(trainedModelId, predictionInputs);
      const pred = response.prediction;
      setPredictionResult(`Prediction: ${pred.prediction || pred}\nConfidence: ${pred.confidence ? (pred.confidence * 100).toFixed(1) + '%' : 'N/A'}`);
    } catch (err: any) {
      setError(err.message || "Failed to make prediction.");
      setPredictionResult('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadModel = async () => {
    if (!trainedModelId) return;
    try {
      const blob = await modelAPI.download(trainedModelId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model_${trainedModelId}.pkl`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || "Failed to download model.");
    }
  };

  // Render Functions for Steps
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Upload
        return (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className={`w-full max-w-md p-8 border-2 border-dashed rounded-2xl text-center transition-colors cursor-pointer relative 
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                disabled={isProcessing}
              />
              <Upload className={`mx-auto h-12 w-12 mb-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${error ? 'text-red-800' : 'text-gray-900'}`}>
                {isProcessing ? 'Uploading...' : error ? 'Upload Failed' : 'Drop your CSV/Excel here'}
              </p>
              <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error ? 'Click to try again' : 'or click to browse'}
              </p>
            </div>
            
            {error && (
               <div className="mt-6 w-full max-w-md bg-red-50 p-4 rounded-xl border border-red-200 flex items-start space-x-3 animate-fade-in">
                 <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                 <p className="text-sm text-red-700 font-medium">{error}</p>
               </div>
            )}

            {dataset && !error && (
              <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm animate-slide-up">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{dataset.name}</p>
                    <p className="text-xs text-gray-500">{dataset.rowCount} rows • {dataset.headers.length} columns</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );

      case 1: // Gathering & Cleaning (AI Analysis)
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><Brain className="w-5 h-5 mr-2 text-purple-500" /> AI Analysis</h3>
              {isProcessing ? (
                <div className="flex flex-col items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-500">Processing data...</p>
                </div>
              ) : insights ? (
                 <div className="prose prose-sm max-w-none text-gray-600">
                   <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-xl">{insights}</pre>
                 </div>
              ) : (
                <div className="text-center py-8">
                  <button 
                    onClick={processStep1_Gathering} 
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all flex items-center mx-auto"
                  >
                    <Zap className="mr-2 w-4 h-4" /> Start AI Data Processing
                  </button>
                </div>
              )}
            </div>
             {!isProcessing && insights && (
                <div className="flex justify-end">
                   <button onClick={() => setCurrentStep(2)} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Proceed to Modeling</button>
                </div>
             )}
          </div>
        );

      case 2: // Modeling & Transformation Selection
      case 3: // Merged for simplicity
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="font-semibold mb-4">Select Models</h3>
                   <div className="space-y-3">
                      {(availableModels.length > 0 ? availableModels : ['Random Forest', 'Linear Regression', 'Decision Tree', 'K-Nearest Neighbors', 'SVM']).map(model => (
                        <div 
                          key={model} 
                          onClick={() => {
                            if (selectedModels.includes(model)) {
                              setSelectedModels(selectedModels.filter(m => m !== model));
                            } else {
                              setSelectedModels([...selectedModels, model]);
                            }
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedModels.includes(model) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                           <div className="flex items-center justify-between">
                             <span className="text-sm font-medium">{model}</span>
                             {selectedModels.includes(model) && <CheckCircle className="w-4 h-4 text-blue-500" />}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                   <h3 className="font-semibold mb-4">Train/Test Split</h3>
                   <div className="mb-6">
                     <div className="flex justify-between text-sm mb-2 font-medium">
                       <span>Train: {splitRatio}%</span>
                       <span>Test: {100 - splitRatio}%</span>
                     </div>
                     <input 
                       type="range" 
                       min="50" 
                       max="90" 
                       value={splitRatio} 
                       onChange={(e) => setSplitRatio(Number(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                     />
                   </div>
                   <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        We recommend a 70/30 split for this dataset size to avoid overfitting.
                      </p>
                   </div>
                </div>
             </div>
             <div className="flex justify-end pt-4">
               <button 
                 disabled={selectedModels.length === 0 || isProcessing}
                 onClick={() => setCurrentStep(4)} 
                 className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-gray-200"
               >
                 <Cpu className="mr-2 w-4 h-4" /> Build Model
               </button>
             </div>
          </div>
        );

      case 4: // Training Animation
        return (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
            <div className="relative w-24 h-24 mb-6">
               <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 animate-spin"></div>
               <Cpu className="absolute inset-0 m-auto text-gray-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Training Models...</h2>
            <p className="text-gray-500">Optimizing hyperparameters and feature engineering.</p>
          </div>
        );

      case 5: // Results & Prediction
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-gray-500 text-sm">Model Accuracy</p>
                   <p className="text-3xl font-bold text-green-600">{trainedModel?.accuracy}</p>
                 </div>
                 <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                   <TrendingUp size={20} />
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-gray-500 text-sm">Model Type</p>
                   <p className="text-xl font-bold text-gray-900">{trainedModel?.name}</p>
                 </div>
                 <Layers size={20} className="text-gray-400"/>
              </div>
               <div 
                 className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={handleDownloadModel}
               >
                 <div>
                   <p className="text-gray-500 text-sm">Download Model</p>
                   <p className="text-sm font-bold text-blue-600">.pkl format</p>
                 </div>
                 <Download size={20} className="text-blue-600"/>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Prediction Form */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-blue-500" /> Real-time Prediction
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   {dataset?.headers.slice(0, -1).slice(0, 5).map(header => (
                     <div key={header}>
                       <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{header}</label>
                       <input 
                         type="text" 
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                         placeholder={`Enter ${header}`}
                         onChange={(e) => setPredictionInputs({...predictionInputs, [header]: e.target.value})}
                       />
                     </div>
                   ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                   <button 
                     onClick={handlePredict}
                     disabled={isProcessing}
                     className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex justify-center items-center"
                   >
                     {isProcessing ? <RefreshCw className="animate-spin mr-2" /> : 'Predict'}
                   </button>
                   {predictionResult && (
                     <div className="mt-4 p-4 bg-gray-900 text-white rounded-xl animate-fade-in">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Result</p>
                        <pre className="text-lg font-mono whitespace-pre-wrap">{predictionResult}</pre>
                     </div>
                   )}
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Feature Analysis</h3>
                <div className="h-64 w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" hide />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No visualization data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Stepper */}
      <div className="mb-12 overflow-x-auto pb-4">
        <div className="flex justify-between items-center min-w-[600px] px-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 
                ${index < currentStep ? 'bg-green-500 border-green-500 text-white' : 
                  index === currentStep ? 'bg-black border-black text-white scale-110 shadow-lg' : 'bg-white border-gray-300 text-gray-400'}`}>
                {index < currentStep ? <CheckCircle size={18} /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-medium transition-colors ${index === currentStep ? 'text-black' : 'text-gray-400'}`}>
                {step}
              </span>
              {index !== steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: 'calc(100% + 2rem)', transform: 'translateX(50%)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && currentStep !== 0 && (
        <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-200 flex items-start space-x-3 animate-fade-in">
          <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {renderStep()}
    </div>
  );
};

export default Dashboard;