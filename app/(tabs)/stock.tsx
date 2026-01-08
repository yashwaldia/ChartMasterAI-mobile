// app/(tabs)/stock.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysis } from '../../hooks/useAnalysis';
import ImagePickerComponent from '../../components/ui/ImagePicker';
import GradientButton from '../../components/layout/GradientButton';
import ErrorBanner from '../../components/ui/ErrorBanner';
import Colors from '../../constants/Colors';
import { INDICATOR_TOOLTIPS } from '../../constants';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const MODES = ['SINGLECHART', 'MULTICHART', 'STRATEGYONLY'] as const;
const COUNTRIES = ['IN', 'OTHER'] as const;
const PLANS = ['Free', 'Pro', 'Advanced'] as const;
const INDICATORS = [
  'MACD',
  'RSI',
  'Bollinger Bands',
  'EMA 20/50/200',
  'Stochastic',
  'Volume Profile',
  'Ichimoku Cloud',
  'Fibonacci',
];

type Mode = (typeof MODES)[number];
type Country = (typeof COUNTRIES)[number];
type Plan = (typeof PLANS)[number];

const PRICING = {
  IN: {
    Free: { price: '₹0', label: 'Free' },
    Pro: { price: '₹99/mo', label: 'Pro' },
    Advanced: { price: '₹299/mo', label: 'Advanced' },
  },
  OTHER: {
    Free: { price: '$0', label: 'Free' },
    Pro: { price: '$4.99/mo', label: 'Pro' },
    Advanced: { price: '$9.99/mo', label: 'Advanced' },
  },
};

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID_STOCK || '';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID || '';

export default function StockScreen() {
  const { analyzeStock, loading: analysisLoading } = useAnalysis();
  const router = useRouter();
  const theme = Colors.dark;

  const [mode, setMode] = useState<Mode>('SINGLECHART');
  const [country, setCountry] = useState<Country>('IN');
  const [plan, setPlan] = useState<Plan>('Free');
  const [strategyRules, setStrategyRules] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      });
  }, []);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      ad.load();
    });

    ad.load();
    setInterstitialAd(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const toggleIndicator = (indicator: string) => {
    const maxIndicators = plan === 'Free' ? 3 : 5;
    
    setSelectedIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator].slice(0, maxIndicators),
    );
  };

  const handleAnalyze = async () => {
    if (images.length === 0 && !strategyRules.trim()) {
      setError('Please upload at least one chart OR enter strategy rules');
      return;
    }

    if (mode === 'STRATEGYONLY' && !strategyRules.trim()) {
      setError('Strategy rules are required for Strategy Only mode');
      return;
    }

    setError('');

    if (interstitialLoaded && interstitialAd) {
      interstitialAd.show();
      setTimeout(() => {
        proceedWithAnalysis();
      }, 500);
    } else {
      proceedWithAnalysis();
    }
  };

  const proceedWithAnalysis = async () => {
    try {
      await analyzeStock({
        images,
        country,
        mode,
        plan,
        strategyRules: strategyRules.trim() || undefined,
        indicators: selectedIndicators,
      });

      router.push('/result/stock');
    } catch (err: any) {
      const message = err?.message || 'Analysis failed. Please try again.';
      setError(message);
    }
  };

  const getModeLabel = (m: Mode) => {
    switch (m) {
      case 'SINGLECHART':
        return 'Single';
      case 'MULTICHART':
        return 'Multi';
      case 'STRATEGYONLY':
        return 'Strategy';
      default:
        return m;
    }
  };

  const pricing = PRICING[country];
  const maxIndicators = plan === 'Free' ? 3 : 5;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.headerBackground,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logoo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Stock Analyzer
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.mutedText }]}>
                Technical Analysis
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.main}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {error ? (
              <ErrorBanner message={error} onClose={() => setError('')} />
            ) : null}

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    Select Plan
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme.mutedText },
                    ]}
                  >
                    Choose analysis depth
                  </Text>
                </View>
              </View>

              <View style={styles.planContainer}>
                {PLANS.map(p => {
                  const active = plan === p;
                  const planPricing = pricing[p];
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPlan(p)}
                      style={[
                        styles.planButton,
                        {
                          backgroundColor: active ? theme.primary : 'transparent',
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={[
                          styles.planLabel,
                          {
                            color: active ? theme.primaryText : theme.text,
                          },
                        ]}
                      >
                        {planPricing.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    Configuration
                  </Text>
                </View>
                <View
                  style={[styles.statusDot, { backgroundColor: theme.success }]}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.labelText }]}>
                  Analysis Mode
                </Text>
                <View style={styles.modeToggleContainer}>
                  {MODES.map(m => {
                    const active = mode === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setMode(m)}
                        style={[
                          styles.modeButton,
                          {
                            backgroundColor: active
                              ? theme.primary
                              : 'transparent',
                            borderColor: active ? theme.primary : theme.border,
                          },
                        ]}
                        activeOpacity={0.6}
                      >
                        <Text
                          style={[
                            styles.modeButtonText,
                            {
                              color: active
                                ? theme.primaryText
                                : theme.mutedText,
                            },
                          ]}
                        >
                          {getModeLabel(m)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.labelText }]}>
                  Region
                </Text>
                <View style={styles.regionToggleContainer}>
                  {COUNTRIES.map(c => {
                    const active = country === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setCountry(c)}
                        style={[
                          styles.regionButton,
                          {
                            backgroundColor: active
                              ? theme.primary
                              : 'transparent',
                            borderColor: active ? theme.primary : theme.border,
                          },
                        ]}
                        activeOpacity={0.6}
                      >
                        <Text
                          style={[
                            styles.regionButtonText,
                            {
                              color: active
                                ? theme.primaryText
                                : theme.mutedText,
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {c === 'IN'
                            ? '🇮🇳 India\n(INR)'
                            : '🌍 International\n(USD)'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {mode === 'STRATEGYONLY' && (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.cardBackground,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                      Custom Strategy
                    </Text>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        { color: theme.mutedText },
                      ]}
                    >
                      Define your trading rules
                    </Text>
                  </View>
                  <View
                    style={[styles.chip, { backgroundColor: theme.primary }]}
                  >
                    <Text
                      style={[styles.chipText, { color: theme.primaryText }]}
                    >
                      📝 Rules
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.inputBorder,
                      color: theme.text,
                    },
                  ]}
                  placeholder="RSI < 30 AND price > EMA(200) AND Volume > 1.5x avg..."
                  placeholderTextColor={theme.mutedText}
                  value={strategyRules}
                  onChangeText={setStrategyRules}
                  multiline
                  textAlignVertical="top"
                  maxLength={1000}
                />

                <View style={styles.inputFooter}>
                  <Text
                    style={[styles.charCount, { color: theme.labelText }]}
                  >
                    {strategyRules.length}/1000
                  </Text>
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
                <View style={styles.cardHeaderLeft}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    Technical Indicators
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme.mutedText },
                    ]}
                  >
                    {plan === 'Free' 
                      ? 'Select up to 3 basic indicators (Free)'
                      : 'Select up to 5 indicators'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        selectedIndicators.length >= maxIndicators
                          ? theme.primary
                          : theme.elevatedCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      {
                        color:
                          selectedIndicators.length >= maxIndicators
                            ? theme.primaryText
                            : theme.mutedText,
                      },
                    ]}
                  >
                    {selectedIndicators.length}/{maxIndicators}
                  </Text>
                </View>
              </View>

              <View style={styles.indicatorGrid}>
                {INDICATORS.map(indicator => {
                  const active = selectedIndicators.includes(indicator);
                  const disabled =
                    !active && selectedIndicators.length >= maxIndicators;
                  
                  const allowedInFree = plan === 'Free' && 
                    !['RSI', 'MACD', 'EMA 20/50/200'].includes(indicator);
                  
                  return (
                    <TouchableOpacity
                      key={indicator}
                      onPress={() => toggleIndicator(indicator)}
                      disabled={disabled || allowedInFree}
                      style={[
                        styles.indicatorChip,
                        {
                          backgroundColor: active
                            ? theme.primary + '15'
                            : theme.elevatedCard,
                          borderColor: active ? theme.primary : theme.border,
                          opacity: (disabled || allowedInFree) ? 0.4 : 1,
                        },
                      ]}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={[
                          styles.indicatorChipText,
                          {
                            color: active
                              ? theme.primary
                              : theme.mutedText,
                          },
                        ]}
                      >
                        {indicator}
                        {allowedInFree && ' 🔒'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedIndicators.length > 0 && (
                <View style={[styles.insightsContainer, { borderTopColor: theme.border }]}>
                  <Text style={[styles.insightsTitle, { color: theme.text }]}>
                    📊 Indicator Insights
                  </Text>
                  {selectedIndicators.map(key => (
                    <View
                      key={key}
                      style={[
                        styles.insightCard,
                        {
                          backgroundColor: theme.elevatedCard,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.primary },
                        ]}
                      >
                        {key}
                      </Text>
                      <Text
                        style={[
                          styles.insightText,
                          { color: theme.mutedText },
                        ]}
                      >
                        {INDICATOR_TOOLTIPS[key] ||
                          'No description available.'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    Chart Images
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme.mutedText },
                    ]}
                  >
                    Upload charts (single or multi-timeframe)
                  </Text>
                </View>
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        images.length > 0
                          ? theme.primary
                          : theme.elevatedCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      {
                        color:
                          images.length > 0
                            ? theme.primaryText
                            : theme.mutedText,
                      },
                    ]}
                  >
                    {images.length}
                  </Text>
                </View>
              </View>

              <ImagePickerComponent
                images={images}
                setImages={setImages}
              />
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: theme.elevatedCard,
                  borderLeftColor: theme.primary,
                },
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={20}
                color={theme.primary}
                style={styles.infoIcon}
              />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>
                  Analysis Tip
                </Text>
                <Text style={[styles.infoText, { color: theme.mutedText }]}>
                  Upload clear charts with visible indicators for best results.
                  Multiple timeframes provide deeper insights.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: theme.headerBackground,
                borderTopColor: theme.border,
              },
            ]}
          >
            <GradientButton
              title={
                analysisLoading
                  ? 'Analyzing Charts...'
                  : images.length > 0
                  ? `Analyze ${images.length} Chart${
                      images.length > 1 ? 's' : ''
                    }`
                  : 'Analyze Charts'
              }
              onPress={handleAnalyze}
              disabled={
                analysisLoading ||
                (images.length === 0 && !strategyRules.trim())
              }
              loading={analysisLoading}
              size="lg"
            />
          </View>
        </View>
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E3A',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 18,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  planContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  planButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 68,
  },
  planLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  planPrice: {
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  regionToggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  regionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  regionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
    lineHeight: 20,
  },
  textArea: {
    height: 140,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  indicatorChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
  },
  indicatorChipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  insightsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  insightsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  insightCard: {
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  insightText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
});
