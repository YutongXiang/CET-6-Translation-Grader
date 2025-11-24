import { GoogleGenAI, Type } from "@google/genai";
import { GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCORING_RUBRIC = `
13-15分: 译文准确表达了原文的意思。用词贴切，行文流畅，基本上无语言错误，仅有个别小错。
10-12分: 译文基本上表达了原文的意思。文字通顺、连贯，无重大语言错误。
7-9分: 译文勉强表达了原文的意思。用词欠准确，语言错误相当多，其中有些是严重语言错误。
4-6分: 译文仅表达了一小部分原文的意思。用词不准确，有相当多的严重语言错误。
1-3分: 译文支离破碎。除个别词语或句子，绝大部分文字没有表达原文意思。
0分: 未作答，或只有几个孤立的词，或译文与原文毫不相关。
`;

export const assessTranslation = async (chineseText: string, englishText: string): Promise<GradingResult> => {
  try {
    const prompt = `
      你是一位资深的大学英语六级（CET-6）阅卷老师。请根据以下评分标准，对学生的翻译进行严格、专业的评分。

      评分标准：
      ${SCORING_RUBRIC}

      原文（中文）：
      ${chineseText}

      学生译文（英文）：
      ${englishText}

      请提供以下反馈：
      1. score: 0-15分的整数分数。
      2. comments: 详细的评分理由（中文）。
      3. standardTranslation: 一份高质量的标准参考译文（英文）。
      4. improvements: 针对学生译文的具体修改建议。请提取出有问题的原文片段(originalSnippet)，提供修正后的片段(revisedSnippet)，并用中文解释原因(explanation)。
      5. vocabulary: 值得积累的高级句式、短语或词汇（中英对照）。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "The score out of 15" },
            comments: { type: Type.STRING, description: "Detailed comments on why this score was given" },
            standardTranslation: { type: Type.STRING, description: "A high-quality standard translation" },
            improvements: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT, 
                properties: {
                  originalSnippet: { type: Type.STRING, description: "The problematic segment from the student's text" },
                  revisedSnippet: { type: Type.STRING, description: "The corrected segment" },
                  explanation: { type: Type.STRING, description: "Explanation of the correction in Chinese" }
                },
                required: ["originalSnippet", "revisedSnippet", "explanation"]
              },
              description: "Specific suggestions for improvement with original and revised snippets"
            },
            vocabulary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Useful vocabulary and sentence structures to learn"
            }
          },
          required: ["score", "comments", "standardTranslation", "improvements", "vocabulary"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as GradingResult;

  } catch (error) {
    console.error("Error assessing translation:", error);
    throw error;
  }
};