import React, { useState, useEffect } from 'react';
import InputArea from './components/InputArea';
import ResultCard from './components/ResultCard';
import VocabularyLibrary from './components/VocabularyLibrary';
import { assessTranslation } from './services/geminiService';
import { GradingResult, GradingStatus, SavedVocabularyItem } from './types';

const SESSION_STORAGE_KEY = 'cet6_grading_session';

const App: React.FC = () => {
  // Lazy load session data to initialize state
  const [initialSession] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load session", e);
      return null;
    }
  });

  const [chineseText, setChineseText] = useState<string>(initialSession?.chineseText || '');
  const [englishText, setEnglishText] = useState<string>(initialSession?.englishText || '');
  const [status, setStatus] = useState<GradingStatus>(
    initialSession?.result ? GradingStatus.SUCCESS : GradingStatus.IDLE
  );
  const [result, setResult] = useState<GradingResult | null>(initialSession?.result || null);
  const [error, setError] = useState<string | null>(null);
  
  // Vocabulary Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedVocabularyItem[]>(() => {
    try {
      const saved = localStorage.getItem('cet6_vocab_library');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load vocabulary", e);
      return [];
    }
  });

  // Persist vocabulary items
  useEffect(() => {
    localStorage.setItem('cet6_vocab_library', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleGrade = async () => {
    if (!chineseText.trim() || !englishText.trim()) {
      alert("请同时输入中文原文和英文译文");
      return;
    }

    setStatus(GradingStatus.LOADING);
    setError(null);

    try {
      const gradingResult = await assessTranslation(chineseText, englishText);
      setResult(gradingResult);
      setStatus(GradingStatus.SUCCESS);
      
      // Save session to localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        chineseText,
        englishText,
        result: gradingResult
      }));
    } catch (err) {
      setError("评分服务暂时不可用，请稍后重试。");
      setStatus(GradingStatus.ERROR);
    }
  };

  const handleReset = () => {
    setChineseText('');
    setEnglishText('');
    setStatus(GradingStatus.IDLE);
    setResult(null);
    // Clear session from localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const handleSaveVocabulary = (items: string[], category: string) => {
    const newItems: SavedVocabularyItem[] = items.map(content => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      content,
      category,
      createdAt: Date.now()
    }));
    setSavedItems(prev => [...newItems, ...prev]); // Add new items to the top
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => {handleReset(); setIsLibraryOpen(false);}} role="button">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-serif-sc shadow-blue-200 shadow-lg">
              六
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden xs:block">
              大学英语六级翻译评分
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsLibraryOpen(true)}
               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-100"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
               我的表达库
               <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
                 {savedItems.length}
               </span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {status === GradingStatus.IDLE || status === GradingStatus.LOADING || status === GradingStatus.ERROR ? (
          <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] min-h-[600px] flex flex-col gap-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100 rounded-xl p-5 text-slate-700 text-sm flex items-start gap-4 shadow-sm">
              <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base mb-1 text-slate-800">使用说明</p>
                <p className="leading-relaxed text-slate-600">
                  请在左侧输入六级翻译题的中文原文，在右侧输入你的英文翻译。AI 将根据 CET-6 评分标准提供分数、评语、修正建议及高分表达积累。
                  <span className="text-purple-600 font-medium">新功能：</span>你现在可以将优秀的句式勾选并保存到“我的表达库”中，随时复习。
                </p>
              </div>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-md">
                <InputArea
                  label="中文原文"
                  placeholder="在此输入六级翻译题的中文段落..."
                  value={chineseText}
                  onChange={setChineseText}
                  lang="zh-CN"
                  isChinese={true}
                />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-md">
                <InputArea
                  label="你的译文"
                  placeholder="在此输入你的英文翻译..."
                  value={englishText}
                  onChange={setEnglishText}
                  lang="en"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-xl text-center border border-red-100 font-medium flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                {error}
              </div>
            )}

            <div className="flex justify-center pb-8">
              <button
                onClick={handleGrade}
                disabled={status === GradingStatus.LOADING}
                className={`
                  relative px-16 py-4 rounded-2xl text-lg font-bold text-white shadow-xl transition-all duration-300 transform
                  ${status === GradingStatus.LOADING 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-blue-200/50'}
                `}
              >
                {status === GradingStatus.LOADING ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在智能评分中...
                  </span>
                ) : (
                  "开始评分"
                )}
              </button>
            </div>
          </div>
        ) : (
          result && (
            <ResultCard 
              result={result} 
              chineseText={chineseText}
              englishText={englishText}
              onReset={handleReset} 
              onSaveVocabulary={handleSaveVocabulary}
            />
          )
        )}
      </main>

      <VocabularyLibrary 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        items={savedItems}
        setItems={setSavedItems}
      />
    </div>
  );
};

export default App;