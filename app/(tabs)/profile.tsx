// app/(tabs)/profile.tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { sendTestGlobalNotification } from '../../services/globalNotificationService';

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
          {/* App Info Hero Card */}
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

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.cardBackground,
                },
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="trending-up" size={28} color={theme.primary} />
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
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="globe" size={28} color="#10B981" />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Market Intel
              </Text>
              <Text style={[styles.featureText, { color: theme.mutedText }]}>
                Global market insights and macro analysis
              </Text>
            </View>
          </View>

          {/* About Section */}
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
              <Ionicons name="phone-portrait-outline" size={20} color={theme.primary} />
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

          {/* Features List */}
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
              <Ionicons name="flash-outline" size={20} color={theme.primary} />
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

          {/* Disclaimer */}
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
              <Ionicons name="warning-outline" size={20} color={theme.warning} />
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

          {/* Contact & Legal */}
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
              <Ionicons name="mail-outline" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              For feedback, bug reports, or feature requests, please contact us through 
              the support channels on our website or via email at support@chartmasterai.com
            </Text>
            <Text style={[styles.bodyText, { color: theme.mutedText }]}>
              By using this app, you agree to the Terms of Service and Privacy Policy.
            </Text>

            {/* Privacy Policy & Terms Buttons */}
            <View style={styles.legalButtonsContainer}>
              <TouchableOpacity
                style={[styles.legalButton, { backgroundColor: theme.elevatedCard, borderColor: theme.primary }]}
                onPress={handleOpenPrivacyPolicy}
                activeOpacity={0.7}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
                <Text style={[styles.legalButtonText, { color: theme.text }]}>
                  Privacy Policy
                </Text>
                <Ionicons name="open-outline" size={14} color={theme.mutedText} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.legalButton, { backgroundColor: theme.elevatedCard, borderColor: theme.primary }]}
                onPress={handleOpenTerms}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={18} color={theme.primary} />
                <Text style={[styles.legalButtonText, { color: theme.text }]}>
                  Terms of Service
                </Text>
                <Ionicons name="open-outline" size={14} color={theme.mutedText} />
              </TouchableOpacity>
            </View>

            {/* Website Button */}
            <TouchableOpacity
              style={[styles.websiteButton, { backgroundColor: theme.primary }]}
              onPress={handleOpenWebsite}
              activeOpacity={0.8}
            >
              <Ionicons name="globe-outline" size={18} color={theme.primaryText} style={{ marginRight: 8 }} />
              <Text style={[styles.websiteButtonText, { color: theme.primaryText }]}>
                Visit Website
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.mutedText }]}>
              © 2025 ChartMasterAI
            </Text>
            <Text style={[styles.footerText, { color: theme.mutedText }]}>
              Made with ❤️ for traders
            </Text>
          </View>
{/* Test Notification Button */}
<TouchableOpacity
  style={[styles.testButton, { backgroundColor: theme.warning }]}
  onPress={sendTestGlobalNotification}
  activeOpacity={0.8}
>
  <Ionicons name="notifications-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
  <Text style={[styles.testButtonText, { color: '#FFFFFF' }]}>
    🧪 Test Notification (3 sec)
  </Text>
</TouchableOpacity>

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
  logoEmoji: {
    fontSize: 20,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    alignItems: 'center',
  },
  appIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  appLogoImage: {
    width: 68,
    height: 68,
  },
  appIconEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 26,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 17,
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
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardEmoji: {
    fontSize: 20,
  },
  bodyText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureList: {
    gap: 14,
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
    marginTop: 7,
  },
  featureListText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  warningCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  warningEmoji: {
    fontSize: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 12,
  },
  legalButtonsContainer: {
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  legalButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: -0.2,
  },
  websiteButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  websiteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
    testButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
