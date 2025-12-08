// app/result/GlobalResultContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ActiveResult } from './[id]';
import Markdown from 'react-native-markdown-display';
import CircularScore from '../../components/ui/CircularScore';

interface GlobalResultContentProps {
  active: ActiveResult;
}

export default function GlobalResultContent({ active }: GlobalResultContentProps) {
  const theme = Colors.dark;

  const getScoreColor = (score: number, _type: 'global') => {
    if (score >= 70) return theme.warning;
    if (score >= 40) return theme.primary;
    return theme.success;
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment?.includes('Bullish')) return theme.success;
    if (sentiment?.includes('Bearish')) return theme.error;
    return theme.warning;
  };

  const RegionStrengthGrid = () => {
    if (!active.regionalStrength) return null;

    const regions = [
      { key: 'US', label: 'US', icon: 'flag-outline' },
      { key: 'India', label: 'India', icon: 'flag' },
      { key: 'Europe', label: 'Europe', icon: 'earth-outline' },
      { key: 'Asia', label: 'Asia', icon: 'earth-outline' },
    ];

    return (
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
              Regional Strength
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
              Market momentum by region
            </Text>
          </View>
          <Ionicons name="map-outline" size={24} color={theme.primary} />
        </View>

        <View style={styles.regionGrid}>
          {regions.map(({ key, label, icon }) => {
            const strength =
              active.regionalStrength?.[
                key as keyof typeof active.regionalStrength
              ];
            if (strength == null) return null;

            return (
              <View
                key={key}
                style={[
                  styles.regionItem,
                  {
                    backgroundColor: theme.elevatedCard,
                  },
                ]}
              >
                <View style={styles.regionHeader}>
                  <Ionicons name={icon as any} size={16} color={theme.mutedText} />
                  <Text
                    style={[styles.regionLabel, { color: theme.text }]}
                  >
                    {label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.regionValue,
                    { color: getScoreColor(strength, 'global') },
                  ]}
                >
                  {strength}%
                </Text>
                <View style={styles.regionBarContainer}>
                  <View
                    style={[
                      styles.regionBarTrack,
                      { backgroundColor: theme.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.regionBarFill,
                        {
                          width: `${strength}%`,
                          backgroundColor: getScoreColor(strength, 'global'),
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Global Risk Circular Score */}
      {active.globalRiskScore != null && (
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
                Global Risk Meter
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
                Overall market risk environment
              </Text>
            </View>
            <Ionicons name="globe-outline" size={22} color={theme.primary} />
          </View>

          <View style={styles.globalTopRow}>
            <CircularScore
              label="GLOBAL RISK SCORE"
              value={active.globalRiskScore}
              size={130}
              color={getScoreColor(active.globalRiskScore, 'global')}
            />

            {/* Optional legend text */}
            <View style={styles.globalLegend}>
              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getScoreColor(25, 'global') },
                  ]}
                />
                <Text style={[styles.legendText, { color: theme.mutedText }]}>
                  Lower risk / supportive backdrop
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getScoreColor(50, 'global') },
                  ]}
                />
                <Text style={[styles.legendText, { color: theme.mutedText }]}>
                  Neutral to mixed risk conditions
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getScoreColor(80, 'global') },
                  ]}
                />
                <Text style={[styles.legendText, { color: theme.mutedText }]}>
                  Elevated risk / cautious environment
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Regional Strength */}
      <RegionStrengthGrid />

      {/* Global Indices */}
      {Array.isArray(active.globalIndices) &&
        active.globalIndices.length > 0 && (
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
                  Global Indices
                </Text>
                <Text
                  style={[styles.cardSubtitle, { color: theme.mutedText }]}
                >
                  Real-time market overview
                </Text>
              </View>
              <Ionicons name="globe" size={24} color={theme.primary} />
            </View>

            <View style={styles.indicesList}>
              {active.globalIndices.map((g: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.indexItem,
                    { backgroundColor: theme.elevatedCard },
                  ]}
                >
                  <View style={styles.indexInfo}>
                    <Text
                      style={[styles.indexName, { color: theme.text }]}
                    >
                      {g.name}
                    </Text>
                    <Text
                      style={[
                        styles.indexSentiment,
                        { color: getSentimentColor(g.sentiment) },
                      ]}
                    >
                      {g.sentiment}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.indexChange,
                      {
                        color:
                          parseFloat(String(g.change)) >= 0
                            ? theme.success
                            : theme.error,
                      },
                    ]}
                  >
                    {parseFloat(String(g.change)) >= 0 ? '+' : ''}
                    {g.change}%
                  </Text>
                </View>
              ))}
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
              Market Intelligence
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
              AI-generated global analysis
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
              body: {
                color: theme.mutedText,
                fontSize: 13,
                lineHeight: 20,
              },
              heading1: {
                color: theme.text,
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 8,
              },
              heading2: {
                color: theme.text,
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 6,
                marginTop: 8,
              },
              heading3: {
                color: theme.text,
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 4,
                marginTop: 8,
              },
              bullet_list: {
                marginTop: 4,
                marginBottom: 4,
              },
              list_item: {
                flexDirection: 'row',
                marginBottom: 2,
              },
              strong: {
                color: theme.text,
                fontWeight: '700',
              },
              paragraph: {
                marginTop: 2,
                marginBottom: 6,
              },
              code_block: {
                display: 'none',
              },
            }}
          >
            {active.analysisText || 'No analysis available.'}
          </Markdown>
        </View>
      </View>

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

  // Global risk top row
  globalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  globalLegend: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },

  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  scoreCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: 20,
    padding: 18,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 12,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scorePercentage: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 32,
  },

  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  regionItem: {
    flex: 1,
    minWidth: 90,
    borderRadius: 14,
    padding: 14,
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  regionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  regionValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  regionBarContainer: {
    height: 6,
  },
  regionBarTrack: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  regionBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  indicesList: {
    gap: 10,
  },
  indexItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
  },
  indexInfo: {
    flex: 1,
  },
  indexName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  indexSentiment: {
    fontSize: 12,
    fontWeight: '500',
  },
  indexChange: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
    minWidth: 60,
    textAlign: 'right',
  },

  reportContainer: {
    padding: 16,
    borderRadius: 14,
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
