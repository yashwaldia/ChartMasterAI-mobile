// app/result/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysis } from '../../hooks/useAnalysis';
import StockResultContent from './StockResultContent';
import GlobalResultContent from './GlobalResultContent';
import Colors from '../../constants/Colors';
import { shareAsText, exportAsFile, exportAsPdf } from '../../components/utils/ShareExport';

export type ActiveResult = {
  buySellScore?: number;
  riskScore?: number;
  trendStrength?: Array<{ tf: string; value: number; sentiment: string }>;
  globalRiskScore?: number;
  regionalStrength?: {
    US: number;
    India: number;
    Europe: number;
    Asia: number;
  };
  globalIndices?: Array<{ name: string; change: number; sentiment: string }>;
  analysisText: string;
  mode: 'STOCK' | 'GLOBAL';
  country?: 'IN' | 'OTHER';
  plan?: 'Free' | 'Pro' | 'Advanced';
  timestamp: string;
};

export default function ResultScreen() {
  const insets = useSafeAreaInsets(); // ✅ Add this
  const { lastResult, clearResult, loading } = useAnalysis();
  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = Colors.dark;
  
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!lastResult && !loading) {
        Alert.alert(
          'No Data',
          'No analysis result found. Please run an analysis first.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/stock'),
            },
          ]
        );
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [lastResult, loading]);

  const handleBack = () => {
    clearResult();
    router.back();
  };

  const prepareActiveResult = (): ActiveResult => {
    if (!lastResult) throw new Error('No result available');

    return {
      buySellScore: lastResult.vizData?.buySellScore ?? undefined,
      riskScore: lastResult.vizData?.riskScore ?? undefined,
      trendStrength: Array.isArray(lastResult.vizData?.trendStrength)
        ? lastResult.vizData.trendStrength
        : [],
      globalRiskScore: lastResult.vizData?.globalRiskScore ?? undefined,
      regionalStrength: lastResult.vizData?.regionalStrength ?? undefined,
      globalIndices: Array.isArray(lastResult.vizData?.globalIndices)
        ? lastResult.vizData.globalIndices
        : [],
      analysisText: lastResult.text || 'No analysis available.',
      mode: lastResult.mode,
      country: lastResult.mode === 'STOCK' ? lastResult.country : undefined,
      plan: lastResult.mode === 'GLOBAL' ? lastResult.plan : undefined,
      timestamp: lastResult.timestamp,
    };
  };

  const handleShare = () => {
    if (!lastResult) return;
    setShareModalVisible(true);
  };

  const handleShareOption = async (type: 'text' | 'pdf' | 'file') => {
    if (!lastResult) return;

    const activeResult = prepareActiveResult();
    setExportLoading(true);
    setShareModalVisible(false);

    try {
      if (type === 'text') {
        await shareAsText(activeResult);
      } else if (type === 'pdf') {
        await exportAsPdf(activeResult);
      } else if (type === 'file') {
        await exportAsFile(activeResult);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert(
        'Share Failed',
        'Could not share content. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.mutedText }]}>
            Loading results...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lastResult) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No analysis data found
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/stock')}
            style={[styles.emptyButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.6}
          >
            <Text style={[styles.emptyButtonText, { color: theme.primaryText }]}>
              Go to Analysis
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isStockMode = lastResult.mode === 'STOCK';
  const isGlobalMode = lastResult.mode === 'GLOBAL';
  const activeResult = prepareActiveResult();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: theme.elevatedCard }]}
            activeOpacity={0.6}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {isStockMode ? 'Chart Analysis' : 'Global Intelligence'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.mutedText }]}>
              {isStockMode
                ? lastResult.stockMode === 'SINGLECHART'
                  ? 'Single Chart'
                  : lastResult.stockMode === 'MULTICHART'
                  ? 'Multi-Timeframe'
                  : 'Strategy Analysis'
                : `${lastResult.plan || 'Free'} Plan`}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={[styles.actionButton, { backgroundColor: theme.elevatedCard }]}
              disabled={exportLoading}
              activeOpacity={0.6}
            >
              {exportLoading ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Ionicons name="share-outline" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {isStockMode && <StockResultContent active={activeResult} />}
          {isGlobalMode && <GlobalResultContent active={activeResult} />}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.mutedText }]}>
              Generated by ChartMaster AI
            </Text>
            <Text style={[styles.footerText, { color: theme.mutedText }]}>
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={shareModalVisible}
          onRequestClose={() => setShareModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShareModalVisible(false)}
          >
            <Pressable style={[styles.modalContent, { backgroundColor: theme.cardBackground,      paddingBottom: Math.max(24, insets.bottom + 16) }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Share Analysis
                </Text>
                <TouchableOpacity 
                  onPress={() => setShareModalVisible(false)}
                  activeOpacity={0.6}
                >
                  <Ionicons name="close" size={28} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSubtitle, { color: theme.mutedText }]}>
                Choose sharing format:
              </Text>

              <View style={styles.exportOptions}>
                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('text')}
                  disabled={exportLoading}
                  activeOpacity={0.6}
                >
                  <Ionicons name="chatbox-ellipses" size={44} color={theme.success} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as Text
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Quick share via WhatsApp, Telegram, etc.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={theme.mutedText} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('pdf')}
                  disabled={exportLoading}
                  activeOpacity={0.6}
                >
                  <Ionicons name="document-text" size={44} color={theme.primary} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as PDF
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Professional formatted PDF report
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={theme.mutedText} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('file')}
                  disabled={exportLoading}
                  activeOpacity={0.6}
                >
                  <Ionicons name="document" size={44} color={theme.warning} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as File
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Plain text file (.txt)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShareModalVisible(false)}
                activeOpacity={0.6}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.7,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 24,
  },
  exportOptions: {
    gap: 14,
    marginBottom: 20,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 18,
    minHeight: 88,
  },
  exportOptionText: {
    flex: 1,
  },
  exportOptionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  exportOptionDesc: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  cancelButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 58,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
