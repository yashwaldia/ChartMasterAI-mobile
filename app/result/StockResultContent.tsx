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
    // risk
    if (score >= 70) return theme.error;
    if (score >= 40) return theme.warning;
    return theme.success;
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment?.includes('Bullish')) return theme.success;
    if (sentiment?.includes('Bearish')) return theme.error;
    return theme.warning;
  };

  // Get plan from active result
  const plan = active.plan || 'Free';
  const country = active.country || 'OTHER';

  const UpgradeCard = ({ targetPlan }: { targetPlan: 'Pro' | 'Advanced' }) => {
    const handleUpgrade = () => {
      // TODO: Replace with your actual upgrade URL or navigation
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
          <Ionicons name="trending-up" size={28} color={theme.primary} />
          <View style={styles.upgradeHeaderText}>
            <Text style={[styles.upgradeTitle, { color: theme.text }]}>
              Upgrade to {targetPlan}
            </Text>
            {/* <Text style={[styles.upgradePrice, { color: theme.primary }]}>
              {pricing[country][targetPlan]}
            </Text> */}
          </View>
        </View>

        <Text style={[styles.upgradeSubtitle, { color: theme.mutedText }]}>
          Unlock advanced features:
        </Text>

        <View style={styles.featureList}>
          {features[targetPlan].map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={theme.success} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleUpgrade}
          style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.upgradeButtonText, { color: theme.primaryText }]}>
            Upgrade Now
          </Text>
          <Ionicons name="arrow-forward" size={18} color={theme.primaryText} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {/* Score + Trend Row (like website header card) */}
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
            <Ionicons name="stats-chart" size={22} color={theme.primary} />
          </View>

          <View style={styles.topRow}>
            {/* Circular Scores */}
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

            {/* Trend Strength Block */}
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

      {/* Analysis Report */}
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
              body: { color: theme.mutedText, fontSize: 13, lineHeight: 20 },
              heading1: { color: theme.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
              heading2: { color: theme.text, fontSize: 18, fontWeight: '700', marginBottom: 6, marginTop: 8 },
              heading3: { color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 4, marginTop: 8 },
              bullet_list: { marginTop: 4, marginBottom: 4 },
              list_item: { flexDirection: 'row', marginBottom: 2 },
              strong: { color: theme.text, fontWeight: '700' },
              paragraph: { marginTop: 2, marginBottom: 6 },
              code_block: {
                display: 'none',
              },
            }}
          >
            {active.analysisText || 'No analysis available.'}
          </Markdown>
        </View>
      </View>

      {/* Upgrade Card for Free Users */}
      {plan === 'Free' && <UpgradeCard targetPlan="Pro" />}

      {/* Upgrade Card for Pro Users */}
      {plan === 'Pro' && <UpgradeCard targetPlan="Advanced" />}

      {/* Disclaimer */}
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
            size={18}
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Top row: circles + trend */
  topRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scoresColumn: {
    flexDirection: 'column',
    gap: 14,
  },
  trendBlock: {
    flex: 1,
    marginLeft: 8,
  },
  trendBlockHeader: {
    marginBottom: 10,
  },
  trendBlockTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendBlockSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  trendList: {
    gap: 10,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendTf: {
    width: 40,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    minWidth: 70,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },

  reportContainer: {
    padding: 16,
    borderRadius: 14,
  },

  // Upgrade Card Styles
  upgradeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  upgradeHeaderText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  upgradePrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  upgradeSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  featureList: {
    gap: 10,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  disclaimerCard: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});
