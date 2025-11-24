import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let colorClass = 'bg-red-100 text-red-700 border-red-200';
  let label = '需努力';

  if (score >= 13) {
    colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    label = '优秀';
  } else if (score >= 10) {
    colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
    label = '良好';
  } else if (score >= 7) {
    colorClass = 'bg-amber-100 text-amber-700 border-amber-200';
    label = '及格';
  } else if (score >= 4) {
    colorClass = 'bg-orange-100 text-orange-700 border-orange-200';
    label = '不及格';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <span className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wider">综合得分</span>
      <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${colorClass} bg-white mb-2`}>
        <span className="text-4xl font-bold">{score}</span>
        <span className="absolute text-xs top-2 right-4 text-slate-400">/15</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        {label}
      </span>
    </div>
  );
};

export default ScoreBadge;