import React from 'react';

interface InputAreaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  lang?: string;
  isChinese?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ label, placeholder, value, onChange, lang, isChinese }) => {
  return (
    <div className="flex flex-col h-full">
      <label className="mb-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        className={`
          w-full flex-grow p-4 rounded-xl border border-slate-200 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
          transition-all duration-200 outline-none resize-none 
          text-slate-800 shadow-sm leading-relaxed
          ${isChinese ? 'font-serif-sc text-lg' : 'font-sans text-base'}
        `}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        lang={lang}
        spellCheck={false}
      />
    </div>
  );
};

export default InputArea;