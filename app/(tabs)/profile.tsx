// app/(tabs)/profile.tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const APP_VERSION = '1.0.0';
const BUILD_LABEL = 'Mobile Beta';

export default function AboutScreen() {
  const theme = Colors.dark;

  const handleOpenWebsite = () => {
    Linking.openURL('https://chartmasterai.com').catch(() => {});
  };

  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://www.chartmasterai.com/privacy').catch(() => {});
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://www.chartmasterai.com/terms').catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
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
                Profile & About
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.mutedText }]}>
                App Information
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.cardBackground,
              },
            ]}
          >
            <View style={styles.appIconLarge}>
              <Image
                source={require('../../assets/images/logoo.png')}
                style={styles.appLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>
              ChartMasterAI
            </Text>
            <Text style={[styles.tagline, { color: theme.mutedText }]}>
              AI-powered stock analysis for smarter trading decisions
            </Text>
            <View style={[styles.versionBadge, { backgroundColor: theme.elevatedCard }]}>
              <Text style={[styles.versionText, { color: theme.mutedText }]}>
                v{APP_VERSION} • {BUILD_LABEL}
              </Text>
            </View>
          </View>

          <View style={styles.featuresGrid}>
            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name="trending-up" size={30} color={theme.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Chart Analysis
              </Text>
              <Text style={[styles.featureText, { color: theme.mutedText }]}>
                AI-powered technical analysis of trading charts
              </Text>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: theme.success + '15' }]}>
                <Ionicons name="globe" size={30} color={theme.success} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Market Intel
              </Text>
              <Text style={[styles.featureText, { color: theme.mutedText }]}>
                Global market insights and macro analysis
              </Text>
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
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                About This App
              </Text>
              <Ionicons name="phone-portrait-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              ChartMasterAI helps traders turn raw charts and market data into clear, 
              structured insights using advanced AI technology. Upload candlestick charts 
              or share key market context, and the app generates clean, easy-to-read 
              analysis you can act on.
            </Text>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              Our AI engine analyzes stock charts, multi-timeframe setups, and global 
              market narratives — delivering professional-grade technical analysis 
              directly on your phone.
            </Text>
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
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                What You Can Do
              </Text>
              <Ionicons name="flash-outline" size={22} color={theme.primary} />
            </View>

            <View style={styles.featureList}>
              <View style={styles.featureListItem}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.featureListText, { color: theme.mutedText }]}>
                  Upload screenshots of trading charts and get AI-generated breakdowns of trend, 
                  momentum, and key levels
                </Text>
              </View>

              <View style={styles.featureListItem}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.featureListText, { color: theme.mutedText }]}>
                  Analyze indicators like MACD, RSI, EMAs, Bollinger Bands, and more with 
                  focused AI insights
                </Text>
              </View>

              <View style={styles.featureListItem}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.featureListText, { color: theme.mutedText }]}>
                  Get global market intelligence and structured macro views for informed 
                  trading decisions
                </Text>
              </View>

              <View style={styles.featureListItem}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.featureListText, { color: theme.mutedText }]}>
                  Export and share detailed PDF reports with buy/sell scores and risk analysis
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.warningCard,
              {
                backgroundColor: theme.elevatedCard,
                borderLeftColor: theme.warning,
              },
            ]}
          >
            <View style={styles.warningHeader}>
              <Ionicons name="warning-outline" size={22} color={theme.warning} />
              <Text style={[styles.warningTitle, { color: theme.warning }]}>
                Important Disclaimer
              </Text>
            </View>
            <Text style={[styles.warningText, { color: theme.mutedText }]}>
              ChartMasterAI is an educational and research tool. It does not provide 
              financial, investment, or trading advice, and no output should be treated as 
              a recommendation to buy or sell any security, cryptocurrency, or instrument.
            </Text>
            <Text style={[styles.warningText, { color: theme.mutedText }]}>
              All analysis is generated by AI based on the charts and text you provide. 
              Markets are risky and unpredictable. Always do your own research, manage risk 
              carefully, and consult a qualified financial professional before making trading 
              or investment decisions.
            </Text>
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
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Contact & Legal
              </Text>
              <Ionicons name="mail-outline" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              For feedback, bug reports, or feature requests, please contact us through 
              the support channels on our website or via email at support@chartmasterai.com
            </Text>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              By using this app, you agree to the Terms of Service and Privacy Policy.
            </Text>

            <View style={styles.legalButtonsContainer}>
              <TouchableOpacity
                style={[styles.legalButton, { backgroundColor: theme.elevatedCard, borderColor: theme.primary }]}
                onPress={handleOpenPrivacyPolicy}
                activeOpacity={0.6}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.primary} />
                <Text style={[styles.legalButtonText, { color: theme.text }]}>
                  Privacy Policy
                </Text>
                <Ionicons name="open-outline" size={16} color={theme.mutedText} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.legalButton, { backgroundColor: theme.elevatedCard, borderColor: theme.primary }]}
                onPress={handleOpenTerms}
                activeOpacity={0.6}
              >
                <Ionicons name="document-text-outline" size={20} color={theme.primary} />
                <Text style={[styles.legalButtonText, { color: theme.text }]}>
                  Terms of Service
                </Text>
                <Ionicons name="open-outline" size={16} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.websiteButton, { backgroundColor: theme.primary }]}
              onPress={handleOpenWebsite}
              activeOpacity={0.6}
            >
              <Ionicons name="globe-outline" size={20} color={theme.primaryText} style={{ marginRight: 8 }} />
              <Text style={[styles.websiteButtonText, { color: theme.primaryText }]}>
                Visit Website
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
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
  logoEmoji: {
    fontSize: 20,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  appIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  appLogoImage: {
    width: 76,
    height: 76,
  },
  appIconEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  versionBadge: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureEmoji: {
    fontSize: 26,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 19,
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardEmoji: {
    fontSize: 20,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginBottom: 14,
  },
  featureList: {
    gap: 16,
  },
  featureListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  featureListText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  warningCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  warningEmoji: {
    fontSize: 20,
  },
  warningTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginBottom: 14,
  },
  legalButtonsContainer: {
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    minHeight: 56,
  },
  legalButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  websiteButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
  },
  websiteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  }
});
