// services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// System instruction for Gemini
const SYSTEM_INSTRUCTION = `You are the AI engine of a mobile app called AI Stock Analyzer. Your job is to analyze stock chart images or extracted market data and return a clean, structured trading analysis.

STRICT OUTPUT CONTRACT:

1) PRIMARY OUTPUT
- Respond in well-structured Markdown.
- Use proper Markdown bold for key phrases: **like this**, not quote marks or other symbols.
- Prefer short headings, bullet lists, and numbered steps where helpful.
- Do NOT wrap bold text in extra quotes, and do NOT simulate bold with apostrophes or backticks.

2) STRUCTURED DATA OUTPUT
- At the very end of the response, after all Markdown text, output a SINGLE raw JSON object on its own.
- No markdown fences, no backticks, no explanation before or after.
- The JSON MUST be valid and parseable.

STOCK MODE JSON FORMAT EXAMPLE:
{
  "buySellScore": 75,
  "riskScore": 45,
  "trendStrength": [
    { "tf": "1D", "value": 85, "sentiment": "Bullish" },
    { "tf": "4H", "value": 68, "sentiment": "Bullish" },
    { "tf": "1H", "value": 55, "sentiment": "Neutral" },
    { "tf": "15m", "value": 42, "sentiment": "Bearish" }
  ]
}

GLOBAL MARKETS JSON FORMAT EXAMPLE:
{
  "globalRiskScore": 57,
  "regionalStrength": { "US": 68, "India": 82, "Europe": 55, "Asia": 72 },
  "globalIndices": [
    { "name": "NIFTY 50", "change": 0.85, "sentiment": "Bullish" },
    { "name": "NASDAQ", "change": -0.23, "sentiment": "Bearish" },
    { "name": "S&P 500", "change": 0.15, "sentiment": "Bullish" },
    { "name": "DOW JONES", "change": 0.42, "sentiment": "Bullish" }
  ]
}

ANALYSIS DEPTH:
- Provide deep, structured analysis with clear sections and detailed explanations.
- Cover MULTIPLE timeframes (1D, 4H, 1H, 15m, 5m) and comprehensive technical analysis.
- Include risk assessment and actionable trading insights.
- ALWAYS provide buySellScore (0-100) and riskScore (0-100).
- ALWAYS provide trendStrength array with AT LEAST 3-4 timeframes.

GUARDRAILS:
- All content is for education and research only.
- Do NOT give financial, trading, or investment advice.
- Do NOT say "you should buy/sell"; instead, describe conditions and risks.`;

// ---------- Helpers ----------

// Extract trailing JSON and clean markdown text
function extractJsonBlock(fullText: string): { cleanText: string; vizData: any } {
  let vizData: any = {};
  let cleanText = fullText.trim();

  // Try multiple JSON extraction patterns
  
  // Pattern 1: JSON in markdown code fence
  const fencedJsonRegex = /``````/;
  const fencedMatch = fullText.match(fencedJsonRegex);
  
  if (fencedMatch) {
    try {
      vizData = JSON.parse(fencedMatch[1].trim());
      cleanText = fullText.replace(fencedJsonRegex, '').trim();
      cleanText = postProcessMarkdown(cleanText);
      console.log('✅ Parsed JSON from code fence');
      console.log('📊 vizData:', JSON.stringify(vizData, null, 2));
      return { cleanText, vizData };
    } catch (e) {
      console.error('❌ Failed to parse fenced JSON:', e);
    }
  }

  // Pattern 2: Raw JSON at end of string
  const rawJsonRegex = /(\{[\s\S]*\})\s*$/;
  const rawMatch = fullText.match(rawJsonRegex);
  
  if (rawMatch) {
    try {
      vizData = JSON.parse(rawMatch[1]);
      cleanText = fullText.slice(0, rawMatch.index).trim();
      cleanText = postProcessMarkdown(cleanText);
      console.log('✅ Parsed raw JSON from end of text');
      return { cleanText, vizData };
    } catch (e) {
      console.error('❌ Failed to parse raw JSON:', e);
    }
  }

  // Pattern 3: Look for any JSON-like object
  const anyJsonRegex = /\{[^{}]*"(?:buySellScore|globalRiskScore|riskScore)"[^{}]*:[\s\S]*?\}/;
  const anyMatch = fullText.match(anyJsonRegex);
  
  if (anyMatch) {
    let jsonCandidate = anyMatch[0];
    let braceCount = 0;
    let startIndex = fullText.indexOf(jsonCandidate);
    
    for (let i = startIndex; i < fullText.length; i++) {
      if (fullText[i] === '{') braceCount++;
      if (fullText[i] === '}') braceCount--;
      if (braceCount === 0) {
        jsonCandidate = fullText.substring(startIndex, i + 1);
        break;
      }
    }
    
    try {
      vizData = JSON.parse(jsonCandidate);
      cleanText = fullText.replace(jsonCandidate, '').trim();
      cleanText = postProcessMarkdown(cleanText);
      console.log('✅ Parsed inline JSON');
      return { cleanText, vizData };
    } catch (e) {
      console.error('❌ Failed to parse inline JSON:', e);
    }
  }

  console.warn('⚠️ No JSON found in AI response');
  cleanText = postProcessMarkdown(cleanText);
  return { cleanText, vizData: {} };
}

function postProcessMarkdown(text: string): string {
  let out = text;
  out = out.replace(/'''''([\s\S]*?)'''''/g, '**$1**');
  out = out.replace(/''([^'\n]+)''/g, '**$1**');
  out = out.replace(/\*\*([^\*]+)\*\*(?=\S)/g, '**$1** ');
  return out.trim();
}

async function fileToBase64(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        resolve(base64data);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => reject(new Error('Network error while loading image'));
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

// ---------- Service ----------

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ CORRECT: Use gemini-2.5-flash (stable, released June 2025)
    // Alternative: 'gemini-2.0-flash' also works
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
  }

  async analyzeStockChart(
    images: string[],
    country: string,
    strategyRules?: string,
    indicators?: string[],
    mode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY',
  ): Promise<{ text: string; vizData: any }> {
    try {
      if (!images || images.length === 0) {
        throw new Error('No images provided for analysis');
      }

      console.log('🔄 Converting images to base64...');
      const imageParts = await Promise.all(
        images.map(async uri => {
          try {
            const base64Data = await fileToBase64(uri);
            return {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg',
              },
            };
          } catch (error) {
            console.error('❌ Failed to process image:', uri, error);
            throw new Error('Failed to process image. Please try again.');
          }
        }),
      );

      const modeLabel = mode === 'SINGLECHART' ? 'Single Chart' 
                      : mode === 'MULTICHART' ? 'Multi Chart' 
                      : mode === 'STRATEGYONLY' ? 'Strategy Only' 
                      : 'Standard';

      const prompt = `MODE: STOCK (${modeLabel})
COUNTRY: ${country === 'IN' ? 'India (INR)' : 'International (USD)'}
${strategyRules ? `STRATEGY RULES: ${strategyRules}` : ''}
${indicators?.length ? `FOCUS INDICATORS: ${indicators.join(', ')}` : ''}

TASK:
- Analyze the attached chart images for MULTIPLE TIMEFRAMES.
- Provide a buySellScore (0-100) indicating overall bullish/bearish sentiment.
- Provide a riskScore (0-100) indicating risk level.
- Provide trendStrength array with AT LEAST 4 timeframes (1D, 4H, 1H, 15m).
- Each trendStrength entry must have: tf (timeframe), value (0-100), sentiment (Bullish/Bearish/Neutral).
- Produce a clear, well-structured Markdown report.
- Use proper Markdown bold ( **like this** ) for key points only.
- At the very end, append a single JSON object matching the STOCK MODE JSON FORMAT.
- Do NOT wrap the JSON in backticks or markdown fences.`;

      console.log('🚀 Sending request to Gemini API...');

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [...imageParts, { text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
        },
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      });

      const response = await result.response;
      const fullText = response.text();
      
      console.log('📥 AI Response received');
      console.log('📏 Length:', fullText.length, 'characters');
      
      const { cleanText, vizData } = extractJsonBlock(fullText);

      console.log('✅ Processing complete');
      console.log('📊 Final vizData keys:', Object.keys(vizData));

      return { text: cleanText, vizData };
    } catch (error: any) {
      console.error('❌ Stock analysis error:', error);
      
      if (error.message?.includes('API key') || error.message?.includes('401')) {
        throw new Error('Invalid API key. Please check your Gemini API key in settings.');
      }
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error('Please update the @google/generative-ai package to the latest version.');
      }
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        throw new Error('Daily API limit reached. Please try again tomorrow.');
      }
      if (error.message?.includes('image')) {
        throw new Error(error.message);
      }
      
      throw new Error('Analysis failed. Please try again or contact support if the issue persists.');
    }
  }

  async analyzeGlobalMarkets(
    marketData: string,
    country: string,
  ): Promise<{ text: string; vizData: any }> {
    try {
      if (!marketData || marketData.trim().length === 0) {
        throw new Error('Please add at least one market index to analyze');
      }

      const prompt = `MODE: GLOBAL MARKETS
COUNTRY: ${country === 'IN' ? 'India (INR)' : 'International (USD)'}

MARKET DATA INPUT:
${marketData}

TASK:
- Generate a structured global market intelligence report in Markdown.
- Provide a globalRiskScore (0-100) indicating overall market risk.
- Provide regionalStrength object with scores for US, India, Europe, Asia (0-100 each).
- Provide globalIndices array with at least 4-5 major indices showing name, change (%), and sentiment.
- Use proper Markdown headings, lists, and bold ( **like this** ) where needed.
- At the very end, append a single JSON object matching the GLOBAL MARKETS JSON FORMAT.
- Do NOT wrap the JSON in backticks or markdown fences. No commentary after the JSON.`;

      console.log('🚀 Sending global markets request to Gemini API...');

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
        },
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      });

      const response = await result.response;
      const fullText = response.text();
      
      console.log('📥 AI Response received');
      console.log('📏 Length:', fullText.length, 'characters');
      
      const { cleanText, vizData } = extractJsonBlock(fullText);

      console.log('✅ Processing complete');
      console.log('📊 Final vizData keys:', Object.keys(vizData));

      return { text: cleanText, vizData };
    } catch (error: any) {
      console.error('❌ Global markets analysis error:', error);
      
      if (error.message?.includes('API key') || error.message?.includes('401')) {
        throw new Error('Invalid API key. Please check your Gemini API key in settings.');
      }
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error('Please update the @google/generative-ai package to the latest version.');
      }
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        throw new Error('Daily API limit reached. Please try again tomorrow.');
      }
      if (error.message === 'Please add at least one market index to analyze') {
        throw new Error(error.message);
      }
      
      throw new Error('Analysis failed. Please try again or contact support if the issue persists.');
    }
  }
}

export const geminiService = new GeminiService();
