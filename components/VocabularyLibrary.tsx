import React, { useState, useMemo } from 'react';
import { SavedVocabularyItem, VOCAB_CATEGORIES } from '../types';

interface VocabularyLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  items: SavedVocabularyItem[];
  setItems: (items: SavedVocabularyItem[]) => void;
}

const VocabularyLibrary: React.FC<VocabularyLibraryProps> = ({ isOpen, onClose, items, setItems }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states for adding/editing
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState(VOCAB_CATEGORIES[0]);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== '全部') {
      filtered = items.filter(item => item.category === activeCategory);
    }
    // Sort by newest first
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [items, activeCategory]);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条表达吗？')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const startEdit = (item: SavedVocabularyItem) => {
    setEditingId(item.id);
    setFormContent(item.content);
    setFormCategory(item.category);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormContent('');
    setFormCategory(activeCategory === '全部' ? VOCAB_CATEGORIES[0] : activeCategory);
  };

  const handleSave = () => {
    if (!formContent.trim()) return;

    if (isAdding) {
      const newItem: SavedVocabularyItem = {
        id: Date.now().toString(),
        content: formContent.trim(),
        category: formCategory,
        createdAt: Date.now(),
      };
      setItems([newItem, ...items]);
      setIsAdding(false);
    } else if (editingId) {
      setItems(items.map(item => 
        item.id === editingId 
          ? { ...item, content: formContent.trim(), category: formCategory }
          : item
      ));
      setEditingId(null);
    }
    setFormContent('');
  };

  const handleExport = () => {
    if (items.length === 0) {
      alert("表达库为空，无需导出");
      return;
    }

    // 构建导出内容
    let content = "========================================\n";
    content += "      大学英语六级翻译 - 我的表达库      \n";
    content += "========================================\n";
    content += `导出日期: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    content += `总条目数: ${items.length} 条\n\n`;

    let hasContent = false;

    VOCAB_CATEGORIES.forEach(category => {
      // 找到该分类下的所有条目
      const categoryItems = items.filter(item => item.category === category);
      
      if (categoryItems.length > 0) {
        hasContent = true;
        content += `\n【 ${category} 】\n`;
        content += "----------------------------------------\n";
        categoryItems.forEach((item, index) => {
          content += `${index + 1}. ${item.content}\n`;
        });
        content += "\n";
      }
    });

    if (!hasContent) {
      content += "（暂无分类内容）\n";
    }

    content += "\n========================================\n";
    content += "加油！坚持积累，六级必过！\n";

    // 创建 Blob 对象并触发下载
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CET6_表达库_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            表达积累库
          </h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button 
                onClick={handleExport}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                title="导出为文本文件"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出 TXT
              </button>
            )}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-slate-50 border-r border-slate-100 overflow-y-auto p-2 flex flex-col gap-1">
            <button
              onClick={() => setActiveCategory('全部')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === '全部' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部 ({items.length})
            </button>
            {VOCAB_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat} ({items.filter(i => i.category === cat).length})
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-700">{activeCategory}</h3>
              <button 
                onClick={startAdd}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加表达
              </button>
            </div>

            {/* Edit/Add Form */}
            {(isAdding || editingId) && (
              <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in-down">
                <div className="flex flex-col gap-4">
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-200 outline-none resize-none text-slate-700"
                    placeholder="输入句子或短语..."
                    rows={3}
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-purple-200 text-sm text-slate-600 focus:outline-none"
                    >
                      {VOCAB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex-1"></div>
                    <button 
                      onClick={() => { setIsAdding(false); setEditingId(null); }}
                      className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700 font-medium"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>暂无收藏的表达</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div key={item.id} className="group bg-white border border-slate-100 rounded-xl p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 flex justify-between items-start gap-4">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{item.category}</span>
                         <span className="text-slate-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                       </div>
                       <p className="text-slate-700 leading-relaxed">{item.content}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         title="删除"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyLibrary;