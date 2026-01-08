// app/result/StockResultContent.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ActiveResult } from './[id]';
import Markdown from 'react-native-markdown-display';
import CircularScore from '../../components/ui/CircularScore';

interface StockResultContentProps {
  active: ActiveResult;
}

export default function StockResultContent({ active }: StockResultContentProps) {
  const theme = Colors.dark;

  const getScoreColor = (score: number, type: 'buy' | 'risk') => {
    if (type === 'buy') {
      if (score >= 70) return theme.success;
      if (score >= 40) return theme.warning;
      return theme.error;
    }
    if (score >= 70) return theme.error;
    if (score >= 40) return theme.warning;
    return theme.success;
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment?.includes('Bullish')) return theme.success;
    if (sentiment?.includes('Bearish')) return theme.error;
    return theme.warning;
  };

  const plan = active.plan || 'Free';
  const country = active.country || 'OTHER';

  const UpgradeCard = ({ targetPlan }: { targetPlan: 'Pro' | 'Advanced' }) => {
    const handleUpgrade = () => {
      Linking.openURL('https://chartmasterai.com/upgrade');
    };

    const pricing = {
      IN: {
        Pro: '₹99/month',
        Advanced: '₹299/month',
      },
      OTHER: {
        Pro: '$4.99/month',
        Advanced: '$9.99/month',
      },
    };

    const features = {
      Pro: [
        'Full 10-indicator analysis',
        'Multi-timeframe trend strength',
        'Buy/Sell scores & Risk meter',
        'Pattern detection (Name + Strength)',
        'Entry/Stop Loss/Target suggestions',
        'Beginner-friendly explanations',
      ],
      Advanced: [
        'All Pro features',
        'Pattern Education blocks',
        'Detailed Entry/SL/Target with R:R ratio',
        'Multi-chart comparison',
        'Advanced multi-timeframe matrix',
        'Multi-timeframe EMA & RSI analysis',
        'Custom strategy results',
        'Institutional-grade insights',
      ],
    };

    return (
      <View
        style={[
          styles.upgradeCard,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.primary,
          },
        ]}
      >
        <View style={styles.upgradeHeader}>
          <Ionicons name="trending-up" size={32} color={theme.primary} />
          <View style={styles.upgradeHeaderText}>
            <Text style={[styles.upgradeTitle, { color: theme.text }]}>
              Upgrade to {targetPlan}
            </Text>
          </View>
        </View>

        <Text style={[styles.upgradeSubtitle, { color: theme.mutedText }]}>
          Unlock advanced features:
        </Text>

        <View style={styles.featureList}>
          {features[targetPlan].map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleUpgrade}
          style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.6}
        >
          <Text style={[styles.upgradeButtonText, { color: theme.primaryText }]}>
            Upgrade Now
          </Text>
          <Ionicons name="arrow-forward" size={20} color={theme.primaryText} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {(active.buySellScore != null ||
        active.riskScore != null ||
        (Array.isArray(active.trendStrength) &&
          active.trendStrength.length > 0)) && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Chart Intelligence
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
                Multi-timeframe technical view
              </Text>
            </View>
            <Ionicons name="stats-chart" size={24} color={theme.primary} />
          </View>

          <View style={styles.topRow}>
            <View style={styles.scoresColumn}>
              {active.buySellScore != null && (
                <CircularScore
                  label="BUY/SELL SCORE"
                  value={active.buySellScore}
                  size={120}
                  color={getScoreColor(active.buySellScore, 'buy')}
                />
              )}

              {active.riskScore != null && (
                <CircularScore
                  label="RISK LEVEL"
                  value={active.riskScore}
                  size={120}
                  color={getScoreColor(active.riskScore, 'risk')}
                />
              )}
            </View>

            {Array.isArray(active.trendStrength) &&
              active.trendStrength.length > 0 && (
                <View style={styles.trendBlock}>
                  <View style={styles.trendBlockHeader}>
                    <Text
                      style={[styles.trendBlockTitle, { color: theme.text }]}
                    >
                      Trend Strength
                    </Text>
                    <Text
                      style={[
                        styles.trendBlockSubtitle,
                        { color: theme.mutedText },
                      ]}
                    >
                      Key timeframes
                    </Text>
                  </View>

                  <View style={styles.trendList}>
                    {active.trendStrength.map((trend: any, index: number) => (
                      <View key={index} style={styles.trendRow}>
                        <Text
                          style={[
                            styles.trendTf,
                            { color: theme.text },
                          ]}
                        >
                          {trend.tf}
                        </Text>

                        <View
                          style={[
                            styles.trendBarTrack,
                            { backgroundColor: theme.elevatedCard },
                          ]}
                        >
                          <View
                            style={[
                              styles.trendBarFill,
                              {
                                width: `${trend.value}%`,
                                backgroundColor: getSentimentColor(
                                  trend.sentiment,
                                ),
                              },
                            ]}
                          />
                        </View>

                        <Text
                          style={[
                            styles.trendSentiment,
                            { color: getSentimentColor(trend.sentiment) },
                          ]}
                        >
                          {trend.sentiment}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
          </View>
        </View>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Analysis Report
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
              AI-generated insights
            </Text>
          </View>
          <Ionicons name="document-text" size={24} color={theme.primary} />
        </View>

        <View
          style={[
            styles.reportContainer,
            { backgroundColor: theme.elevatedCard },
          ]}
        >
          <Markdown
            style={{
              body: { color: theme.mutedText, fontSize: 14, lineHeight: 21 },
              heading1: { color: theme.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
              heading2: { color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 8, marginTop: 10 },
              heading3: { color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 6, marginTop: 10 },
              bullet_list: { marginTop: 6, marginBottom: 6 },
              list_item: { flexDirection: 'row', marginBottom: 4 },
              strong: { color: theme.text, fontWeight: '700' },
              paragraph: { marginTop: 4, marginBottom: 8 },
              code_block: {
                display: 'none',
              },
            }}
          >
            {active.analysisText || 'No analysis available.'}
          </Markdown>
        </View>
      </View>

      {plan === 'Free' && <UpgradeCard targetPlan="Pro" />}

      {plan === 'Pro' && <UpgradeCard targetPlan="Advanced" />}

      <View
        style={[
          styles.disclaimerCard,
          {
            backgroundColor: theme.elevatedCard,
            borderLeftColor: theme.warning,
          },
        ]}
      >
        <View style={styles.disclaimerHeader}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={theme.warning}
          />
          <Text
            style={[styles.disclaimerTitle, { color: theme.warning }]}
          >
            Educational Content Only
          </Text>
        </View>
        <Text style={[styles.disclaimerText, { color: theme.mutedText }]}>
          This analysis is AI-generated for educational purposes. Not financial
          advice. Always do your own research and consult a qualified advisor
          before trading.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },

  topRow: {
    flexDirection: 'row',
    gap: 20,
  },
  scoresColumn: {
    flexDirection: 'column',
    gap: 16,
  },
  trendBlock: {
    flex: 1,
    marginLeft: 4,
  },
  trendBlockHeader: {
    marginBottom: 12,
  },
  trendBlockTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  trendBlockSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  trendList: {
    gap: 12,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trendTf: {
    width: 42,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  trendBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  trendSentiment: {
    minWidth: 74,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: -0.1,
  },

  reportContainer: {
    padding: 18,
    borderRadius: 16,
  },

  upgradeCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  upgradeHeaderText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  upgradePrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  upgradeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    minHeight: 56,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  disclaimerCard: {
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  disclaimerText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
});
