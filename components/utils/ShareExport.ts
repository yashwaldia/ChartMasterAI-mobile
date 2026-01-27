// components/utils/ShareExport.ts

import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';
import { Alert } from 'react-native';
import { ActiveResult } from '../../app/result/[id]';

// ========== Share as Plain Text ==========
export async function shareAsText(active: ActiveResult): Promise<void> {
  try {
    const content = formatAnalysisText(active);
    
    // Create HTML wrapper for text content with dark theme
    const textHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      white-space: pre-wrap; 
      padding: 20px; 
      font-size: 13px;
      background: #0A0A0A;
      color: #E5E5E5;
      line-height: 1.6;
    }
  </style>
</head>
<body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
</html>`;

    const { uri } = await printToFileAsync({
      html: textHtml,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Analysis',
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Error', 'Failed to share analysis');
  }
}

// ========== Export as Text File ==========
export async function exportAsFile(active: ActiveResult): Promise<void> {
  try {
    const content = formatAnalysisText(active);
    
    // Create HTML wrapper for text content with dark theme
    const textHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      white-space: pre-wrap; 
      padding: 20px; 
      font-size: 13px;
      background: #0A0A0A;
      color: #E5E5E5;
      line-height: 1.6;
    }
  </style>
</head>
<body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
</html>`;

    const { uri } = await printToFileAsync({
      html: textHtml,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Analysis',
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Error', 'Failed to export analysis');
  }
}

// ========== Export as PDF with Dark Theme & Circular Progress ==========
export async function exportAsPdf(active: ActiveResult): Promise<void> {
  try {
    const html = generatePdfHtml(active);
    const { uri } = await printToFileAsync({
      html,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: 'com.adobe.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Share Analysis PDF',
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('PDF export error:', error);
    Alert.alert('Error', 'Failed to export PDF');
  }
}

// ========== Helper Functions ==========

// Format plain text
function formatAnalysisText(active: ActiveResult): string {
  const modeTitle = active.mode === 'STOCK' ? '📊 Stock Analysis' : '🌍 Global Intelligence';
  const region = active.country === 'IN' ? '🇮🇳 India (INR)' : '🌍 International (USD)';

  // UPDATED: Branding to ChartMasterAI
  let output = `${modeTitle}\n`;
  output += `ChartMasterAI • ${region}\n`;
  output += `Generated: ${active.timestamp}\n\n`;
  output += `${'═'.repeat(60)}\n\n`;

  if (active.buySellScore != null) output += `Buy/Sell Score: ${active.buySellScore}/100\n`;
  if (active.riskScore != null) output += `Risk Level: ${active.riskScore}/100\n`;
  if (active.globalRiskScore != null) output += `Global Risk: ${active.globalRiskScore}/100\n\n`;

  if (active.trendStrength?.length) {
    output += `📈 Trend Strength:\n`;
    active.trendStrength.forEach((t: any) => {
      output += `  ${t.tf.padEnd(4)}: ${String(t.value).padStart(3)}% ${t.sentiment}\n`;
    });
    output += '\n';
  }

  if (active.globalIndices?.length) {
    output += `🌐 Global Indices:\n`;
    active.globalIndices.forEach((i: any) => {
      const sign = parseFloat(i.change) >= 0 ? '+' : '';
      output += `  ${i.name.padEnd(15)}: ${sign}${i.change}% ${i.sentiment}\n`;
    });
    output += '\n';
  }

  output += `📋 Analysis:\n`;
  output += `${'═'.repeat(60)}\n`;
  output += active.analysisText;
  output += `\n\n${'═'.repeat(60)}\n`;
  output += `⚠️ Educational content only. Not financial advice.\n`;

  return output;
}

// Generate PDF HTML with Dark Theme & Circular Progress
function generatePdfHtml(active: ActiveResult): string {
  // ✅ App Colors (from Colors.ts - Dark Theme)
  const theme = {
    background: '#0A0A0A',
    cardBackground: '#1A1A1A',
    elevatedCard: '#242424',
    text: '#FFFFFF',
    mutedText: '#A3A3A3',
    border: '#2A2A2A',
    primary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const getScoreColor = (score: number, type: 'buy' | 'risk' | 'global') => {
    if (type === 'buy')
      return score >= 70 ? theme.success : score >= 40 ? theme.warning : theme.error;
    if (type === 'risk')
      return score >= 70 ? theme.error : score >= 40 ? theme.warning : theme.success;
    return score >= 70 ? theme.warning : score >= 40 ? theme.primary : theme.success;
  };

  const getSentimentColor = (sentiment: string) => {
    return sentiment?.includes('Bullish')
      ? theme.success
      : sentiment?.includes('Bearish')
      ? theme.error
      : theme.warning;
  };

  // ✅ Function to generate circular progress SVG
  const generateCircularProgress = (score: number, color: string, label: string, subtitle: string) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const remaining = circumference - progress;

    return `
      <div style="flex: 1; text-align: center;">
        <svg width="120" height="120" viewBox="0 0 120 120" style="margin: 0 auto;">
          <circle
            cx="60"
            cy="60"
            r="${radius}"
            fill="none"
            stroke="${theme.border}"
            stroke-width="8"
          />
          <circle
            cx="60"
            cy="60"
            r="${radius}"
            fill="none"
            stroke="${color}"
            stroke-width="8"
            stroke-dasharray="${progress} ${remaining}"
            stroke-dashoffset="0"
            transform="rotate(-90 60 60)"
            stroke-linecap="round"
          />
          <text
            x="60"
            y="55"
            text-anchor="middle"
            font-size="28"
            font-weight="700"
            fill="${color}"
          >${score}</text>
          <text
            x="60"
            y="75"
            text-anchor="middle"
            font-size="12"
            fill="${theme.mutedText}"
          >${subtitle}</text>
        </svg>
        <div style="margin-top: 8px; font-size: 11px; color: ${theme.mutedText}; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
          ${label}
        </div>
      </div>
    `;
  };

  // Process analysis text with proper formatting
  const formatAnalysisText = (text: string) => {
    return text
      // Bold text: **text** or ##text##
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: ' + theme.text + '; font-weight: 700;">$1</strong>')
      .replace(/##(.+?)##/g, '<strong style="color: ' + theme.text + '; font-weight: 700;">$1</strong>')
      // Headers: ### text
      .replace(/###\s*(.+?)(?:\n|$)/g, '<h3 style="color: ' + theme.primary + '; font-size: 16px; font-weight: 700; margin-top: 20px; margin-bottom: 10px;">$1</h3>')
      // Bullet points: • or -
      .replace(/^[•\-]\s*(.+)$/gm, '<li style="margin-left: 20px; margin-bottom: 6px; color: ' + theme.text + ';">$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      padding: 20px; 
      background: ${theme.background};
      color: ${theme.text};
      font-size: 14px;
      line-height: 1.6;
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      padding-bottom: 20px; 
      border-bottom: 2px solid ${theme.primary}; 
    }
    .header h1 { 
      font-size: 28px; 
      color: ${theme.primary}; 
      margin-bottom: 8px; 
      font-weight: 700;
    }
    .header p { 
      font-size: 13px; 
      color: ${theme.mutedText}; 
    }
    .section { 
      margin-bottom: 30px; 
    }
    .section-title { 
      font-size: 18px; 
      font-weight: 700; 
      color: ${theme.text}; 
      margin-bottom: 15px; 
      border-left: 4px solid ${theme.primary}; 
      padding-left: 10px; 
    }
    .metrics { 
      display: flex; 
      gap: 20px; 
      margin-bottom: 25px;
      justify-content: center;
    }
    .trend-item { 
      display: flex; 
      align-items: center; 
      padding: 12px; 
      margin-bottom: 8px; 
      background: ${theme.elevatedCard}; 
      border-radius: 8px; 
    }
    .trend-tf { 
      font-weight: 700; 
      width: 45px; 
      font-size: 13px; 
      color: ${theme.text};
    }
    .trend-bar { 
      flex: 1; 
      height: 8px; 
      background: ${theme.border}; 
      border-radius: 4px; 
      margin: 0 12px; 
      overflow: hidden; 
    }
    .trend-fill { 
      height: 100%; 
      border-radius: 4px; 
    }
    .trend-sentiment { 
      font-weight: 600; 
      font-size: 13px; 
      min-width: 75px; 
      text-align: right; 
    }
    .analysis-text { 
      line-height: 1.8; 
      font-size: 13px; 
      color: ${theme.text}; 
    }
    .analysis-text strong {
      color: ${theme.text};
      font-weight: 700;
    }
    .analysis-text h3 {
      color: ${theme.primary};
      font-size: 16px;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .analysis-text li {
      margin-left: 20px;
      margin-bottom: 6px;
      color: ${theme.text};
    }
    .disclaimer { 
      margin-top: 25px; 
      padding: 12px; 
      background: rgba(245, 158, 11, 0.1); 
      border-left: 4px solid ${theme.warning}; 
      border-radius: 6px; 
    }
    .disclaimer h4 { 
      color: ${theme.warning}; 
      font-size: 13px; 
      margin-bottom: 6px; 
      font-weight: 700;
    }
    .disclaimer p { 
      font-size: 12px; 
      color: ${theme.mutedText}; 
      line-height: 1.5; 
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${active.mode === 'STOCK' ? '📊 Stock Intelligence' : '🌍 Global Intelligence'}</h1>
    <p>ChartMasterAI | ${active.country === 'IN' ? '🇮🇳 India (INR)' : '🌍 International (USD)'} | ${active.timestamp}</p>
  </div>
`;

  // ✅ Circular Score Cards
  if (active.buySellScore != null || active.riskScore != null || active.globalRiskScore != null) {
    html += `<div class="section"><div class="section-title">📊 Key Metrics</div><div class="metrics">`;

    if (active.buySellScore != null) {
      const color = getScoreColor(active.buySellScore, 'buy');
      html += generateCircularProgress(active.buySellScore, color, 'BUY/SELL SCORE', `${active.buySellScore}%`);
    }

    if (active.riskScore != null) {
      const color = getScoreColor(active.riskScore, 'risk');
      html += generateCircularProgress(active.riskScore, color, 'RISK LEVEL', `${active.riskScore}%`);
    }

    if (active.globalRiskScore != null) {
      const color = getScoreColor(active.globalRiskScore, 'global');
      html += generateCircularProgress(active.globalRiskScore, color, 'GLOBAL RISK', `${active.globalRiskScore}%`);
    }

    html += `</div></div>`;
  }

  // ✅ Trend Strength
  if (active.trendStrength?.length) {
    html += `<div class="section"><div class="section-title">📈 Trend Strength</div>`;
    active.trendStrength.forEach((trend: any) => {
      const color = getSentimentColor(trend.sentiment);
      html += `
        <div class="trend-item">
          <div class="trend-tf">${trend.tf}</div>
          <div class="trend-bar">
            <div class="trend-fill" style="width: ${trend.value}%; background: ${color};"></div>
          </div>
          <div class="trend-sentiment" style="color: ${color};">${trend.sentiment}</div>
        </div>`;
    });
    html += `</div>`;
  }

  // ✅ Analysis Report with proper formatting
  html += `
    <div class="section">
      <div class="section-title">📋 ${active.mode === 'STOCK' ? 'Analysis Report' : 'Market Intelligence'}</div>
      <div class="analysis-text">${formatAnalysisText(active.analysisText)}</div>
    </div>
  `;

  // ✅ Disclaimer
  html += `
    <div class="disclaimer">
      <h4>⚠️ Educational Content Only</h4>
      <p>This analysis is AI-generated for educational purposes. Not financial advice. Always do your own research and consult a qualified advisor before trading.</p>
    </div>
  </body>
</html>`;

  return html;
}