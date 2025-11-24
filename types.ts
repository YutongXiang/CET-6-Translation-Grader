export interface ImprovementItem {
  originalSnippet: string;
  revisedSnippet: string;
  explanation: string;
}

export interface GradingResult {
  score: number;
  comments: string;
  standardTranslation: string;
  improvements: ImprovementItem[];
  vocabulary: string[];
}

export interface InputState {
  chineseText: string;
  englishText: string;
}

export enum GradingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SavedVocabularyItem {
  id: string;
  content: string;
  category: string;
  createdAt: number;
}

export const VOCAB_CATEGORIES = [
  "历史文化",
  "经济贸易",
  "社会发展",
  "科技创新",
  "自然环境",
  "校园生活",
  "通用表达",
  "其他"
];