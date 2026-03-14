/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import { analyzeReviews, AnalysisResult } from './services/gemini';
import { FileText, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const data = await analyzeReviews(inputText);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze reviews. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sentiment Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                  <FileText size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyze Customer Reviews</h2>
                <p className="text-slate-500">
                  Paste your raw customer reviews below. Our AI will analyze the sentiment, extract key themes, and provide actionable insights.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your reviews here... (e.g. 'The product is great but shipping was slow...')"
                  className="w-full h-64 p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-700"
                />
                
                {error && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing with Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Analyze New Batch
              </button>
            </div>
            
            <Dashboard data={result} />
            <Chatbot context={JSON.stringify(result, null, 2)} />
          </div>
        )}
      </main>
    </div>
  );
}
