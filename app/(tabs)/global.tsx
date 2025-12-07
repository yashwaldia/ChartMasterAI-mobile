// app/(tabs)/global.tsx
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
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const COUNTRIES = ['IN', 'OTHER'] as const;
type Country = (typeof COUNTRIES)[number];

// Ad Unit IDs
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID || '';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID || '';

export default function GlobalScreen() {
  const { analyzeGlobal, loading: analysisLoading } = useAnalysis();
  const router = useRouter();
  const theme = Colors.dark;

  const [country, setCountry] = useState<Country>('IN');
  const [marketDataInput, setMarketDataInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Initialize AdMob
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      });
  }, []);

  // Load interstitial ad
  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      // Reload ad for next time
      ad.load();
    });

    ad.load();
    setInterstitialAd(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const handleGenerate = async () => {
    if (!marketDataInput.trim() && images.length === 0) {
      setError('Please provide market data/news OR upload dashboard screenshot');
      return;
    }

    setError('');

    // Show interstitial ad before analysis
    if (interstitialLoaded && interstitialAd) {
      interstitialAd.show();
      // Wait a moment for ad to close, then proceed
      setTimeout(() => {
        proceedWithAnalysis();
      }, 500);
    } else {
      // No ad ready, proceed immediately
      proceedWithAnalysis();
    }
  };

  const proceedWithAnalysis = async () => {
    try {
      await analyzeGlobal({
        marketData: marketDataInput.trim(),
        country,
      });

      router.push('/result/global');
    } catch (err: any) {
      const message = err?.message || 'Analysis failed. Please try again.';
      setError(message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
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
                Global Markets
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.mutedText }]}>
                Market Intelligence
              </Text>
            </View>
          </View>
        </View>

        {/* Banner Ad - Top */}
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {error ? (
              <ErrorBanner message={error} onClose={() => setError('')} />
            ) : null}

            {/* Region Selection Card */}
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
                    Select Region
                  </Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
              </View>

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
                          backgroundColor: active ? theme.primary : 'transparent',
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.regionButtonText,
                          { color: active ? theme.primaryText : theme.mutedText },
                        ]}
                        numberOfLines={2}
                      >
                        {c === 'IN' ? '🇮🇳 India\n(INR)' : '🌍 International\n(USD)'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Market Data Input Card */}
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
                    Market Data & News
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
                    Paste market data, indices, or news
                  </Text>
                </View>
                <View style={[styles.chip, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.chipText, { color: theme.primaryText }]}>
                    📊 Live
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
                placeholder={
                  'NIFTY 50: +0.5% (24,500)\n' +
                  'NASDAQ: -0.2% (18,200)\n' +
                  'Fed holds rates steady...\n' +
                  'USD/INR: 84.25 (+0.3%)\n\n' +
                  'Paste headlines, earnings, or economic data...'
                }
                placeholderTextColor={theme.mutedText}
                value={marketDataInput}
                onChangeText={setMarketDataInput}
                multiline
                textAlignVertical="top"
                maxLength={5000}
              />

              <View style={styles.inputFooter}>
                <Text style={[styles.charCount, { color: theme.mutedText }]}>
                  {marketDataInput.length}/5000
                </Text>
              </View>
            </View>

            {/* Image Upload Section */}
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
                    Dashboard Screenshots
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
                    Optional: Upload trading dashboards
                  </Text>
                </View>
              </View>

              <ImagePickerComponent
                images={images}
                setImages={setImages}
                maxImages={2}
              />
            </View>

            {/* Info Card */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: theme.elevatedCard,
                  borderLeftColor: theme.primary,
                },
              ]}
            >
              <Ionicons name="bulb-outline" size={18} color={theme.primary} style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>
                  Pro Tip
                </Text>
                <Text style={[styles.infoText, { color: theme.mutedText }]}>
                  Include multiple data sources for comprehensive market analysis
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Bar */}
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
                analysisLoading ? 'Analyzing Market...' : 'Generate Intel'
              }
              onPress={handleGenerate}
              disabled={
                analysisLoading ||
                (images.length === 0 && !marketDataInput.trim())
              }
              size="lg"
            />
          </View>
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
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(108, 62, 255, 0.1)',
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2B3E',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 0,
  },
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
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  regionToggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  regionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  regionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
    lineHeight: 18,
  },
  textArea: {
    height: 200,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    gap: 10,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
});
