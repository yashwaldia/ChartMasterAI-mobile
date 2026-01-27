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

  // UPDATED: Removed UpgradeCard component to prevent "fake paywall" rejection

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
                  <Ionicons name={icon as any} size={18} color={theme.mutedText} />
                  <Text style={[styles.regionLabel, { color: theme.text }]}>
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
            <Ionicons name="globe-outline" size={24} color={theme.primary} />
          </View>

          <View style={styles.globalTopRow}>
            <CircularScore
              label="GLOBAL RISK SCORE"
              value={active.globalRiskScore}
              size={130}
              color={getScoreColor(active.globalRiskScore, 'global')}
            />

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

      <RegionStrengthGrid />

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
                <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
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
                    <Text style={[styles.indexName, { color: theme.text }]}>
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
                fontSize: 14,
                lineHeight: 21,
              },
              heading1: {
                color: theme.text,
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 10,
              },
              heading2: {
                color: theme.text,
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 8,
                marginTop: 10,
              },
              heading3: {
                color: theme.text,
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 6,
                marginTop: 10,
              },
              bullet_list: {
                marginTop: 6,
                marginBottom: 6,
              },
              list_item: {
                flexDirection: 'row',
                marginBottom: 4,
              },
              strong: {
                color: theme.text,
                fontWeight: '700',
              },
              paragraph: {
                marginTop: 4,
                marginBottom: 8,
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

      {/* UPDATED: Removed Upsell/Upgrade Cards to comply with policy */}

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
          <Text style={[styles.disclaimerTitle, { color: theme.warning }]}>
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

  globalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  globalLegend: {
    flex: 1,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },

  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  regionItem: {
    flex: 1,
    minWidth: 95,
    borderRadius: 16,
    padding: 16,
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  regionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  regionValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
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
    gap: 12,
  },
  indexItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  indexInfo: {
    flex: 1,
  },
  indexName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  indexSentiment: {
    fontSize: 13,
    fontWeight: '500',
  },
  indexChange: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
    minWidth: 70,
    textAlign: 'right',
  },

  reportContainer: {
    padding: 18,
    borderRadius: 16,
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