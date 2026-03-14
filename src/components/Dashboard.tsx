import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WordCloud } from './WordCloud';
import { AnalysisResult } from '../services/gemini';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';

export function Dashboard({ data }: { data: AnalysisResult }) {
  const averageSentiment = data.trend.reduce((acc, curr) => acc + curr.sentimentScore, 0) / data.trend.length;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${averageSentiment > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {averageSentiment > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Overall Sentiment</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {averageSentiment > 0 ? '+' : ''}{(averageSentiment * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-slate-500 mt-1">Average across all periods</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Executive Summary</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {data.executiveSummary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Sentiment Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timePeriod" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  domain={[-1, 1]} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sentimentScore" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Word Cloud */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Key Themes</h3>
          <WordCloud words={data.words} />
        </div>
      </div>

      {/* Actionable Areas */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Top 3 Actionable Areas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.actionableAreas.map((area, index) => (
            <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 font-bold flex items-center justify-center shadow-sm mb-3">
                {index + 1}
              </div>
              <p className="text-slate-700">{area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
