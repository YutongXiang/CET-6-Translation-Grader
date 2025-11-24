import React, { useState } from 'react';
import { GradingResult, VOCAB_CATEGORIES } from '../types';
import ScoreBadge from './ScoreBadge';

interface ResultCardProps {
  result: GradingResult;
  chineseText: string;
  englishText: string;
  onReset: () => void;
  onSaveVocabulary: (items: string[], category: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, chineseText, englishText, onReset, onSaveVocabulary }) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>(VOCAB_CATEGORIES[0]);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
    setIsSaved(false);
  };

  const handleSave = () => {
    const itemsToSave = result.vocabulary.filter((_, idx) => selectedIndices.has(idx));
    if (itemsToSave.length > 0) {
      onSaveVocabulary(itemsToSave, selectedCategory);
      setIsSaved(true);
      // Optional: Clear selection after save or keep it. Keeping it is fine.
      setSelectedIndices(new Set());
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-12">
      
      {/* Input Review Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
           <div className="flex items-center gap-2 mb-3">
             <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">原文 Review</span>
           </div>
           <p className="text-slate-700 font-serif-sc text-lg leading-relaxed whitespace-pre-wrap">
             {chineseText}
           </p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
           <div className="flex items-center gap-2 mb-3">
             <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">你的译文 Review</span>
           </div>
           <p className="text-slate-700 font-sans text-base leading-relaxed whitespace-pre-wrap">
             {englishText}
           </p>
        </div>
      </div>

      {/* Top Section: Score and General Comments */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ScoreBadge score={result.score} />
        </div>
        <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            评语
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {result.comments}
          </p>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
           <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          参考译文
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500">
           <p className="text-slate-800 font-medium leading-relaxed font-sans">
            {result.standardTranslation}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Improvements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            改进建议
          </h3>
          <div className="space-y-4">
            {result.improvements.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-amber-200 transition-colors">
                 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-3">
                    {/* Original */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">原文片段</span>
                        </div>
                        <div className="text-slate-700 bg-red-50/50 p-2.5 rounded-lg border border-red-100 text-sm break-words">
                            {item.originalSnippet}
                        </div>
                    </div>
                    
                    {/* Arrow */}
                     <div className="hidden md:block text-slate-300 flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                     </div>
                     
                     {/* Revised */}
                     <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">修正建议</span>
                        </div>
                        <div className="text-slate-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 text-sm font-medium break-words">
                            {item.revisedSnippet}
                        </div>
                     </div>
                 </div>
                 
                 {/* Explanation */}
                 <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-slate-600 text-sm leading-relaxed flex gap-2 items-start">
                        <span className="text-amber-500 flex-shrink-0 mt-0.5">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                        {item.explanation}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabulary - Selectable & Savable */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              句式与表达积累
            </h3>
            <span className="text-xs text-slate-400">勾选后可存入表达库</span>
          </div>
         
          <div className="flex-grow">
            <ul className="space-y-3">
              {result.vocabulary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleSelection(idx)}>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={selectedIndices.has(idx)}
                      onChange={() => {}} // Handled by li click
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed select-none">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Save Control */}
          {selectedIndices.size > 0 && (
             <div className="mt-6 pt-4 border-t border-slate-100 animate-fade-in">
               <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-full sm:w-auto">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    >
                      {VOCAB_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSave}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-purple-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    保存选中的 {selectedIndices.size} 项
                  </button>
               </div>
             </div>
          )}
          
          {isSaved && (
            <div className="mt-3 text-center text-sm text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-100 animate-fade-in">
              已成功存入“{selectedCategory}”分类！
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
        >
          评分下一篇
        </button>
      </div>
    </div>
  );
};

export default ResultCard;