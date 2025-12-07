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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysis } from '../../hooks/useAnalysis';
import StockResultContent from './StockResultContent';
import GlobalResultContent from './GlobalResultContent';
import Colors from '../../constants/Colors';
import { shareAsText, exportAsFile, exportAsPdf } from '../../components/utils/ShareExport';

// Define types for result data
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
  country: 'IN' | 'OTHER';
  timestamp: string;
};

export default function ResultScreen() {
  const { lastResult, clearResult, loading } = useAnalysis();
  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = Colors.dark;
  
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Check if we have valid result data
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

  // Helper function to prepare ActiveResult
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
      country: lastResult.country,
      timestamp: lastResult.timestamp,
    };
  };

  // ✅ SHARE BUTTON - Opens modal with share options
  const handleShare = () => {
    if (!lastResult) return;
    setShareModalVisible(true);
  };

  // ✅ Handle share option selection
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

  // Show loading state while checking for data
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

  // If no result after loading, don't render
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
          >
            <Text style={[styles.emptyButtonText, { color: '#fff' }]}>
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
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: theme.elevatedCard }]}
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
                : 'Market Report'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* ✅ SHARE BUTTON */}
            <TouchableOpacity
              onPress={handleShare}
              style={[styles.actionButton, { backgroundColor: theme.elevatedCard }]}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Ionicons name="share-outline" size={22} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {isStockMode && <StockResultContent active={activeResult} />}
          {isGlobalMode && <GlobalResultContent active={activeResult} />}

          {/* Info Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.mutedText }]}>
              Generated by AI Stock Chart Analyzer
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

        {/* ✅ SHARE OPTIONS MODAL */}
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
            <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Share Analysis
                </Text>
                <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSubtitle, { color: theme.mutedText }]}>
                Choose sharing format:
              </Text>

              {/* Share Options */}
              <View style={styles.exportOptions}>
                {/* Share as Text */}
                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('text')}
                  disabled={exportLoading}
                >
                  <Ionicons name="chatbox-ellipses" size={40} color={theme.success} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as Text
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Quick share via WhatsApp, Telegram, etc.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.mutedText} />
                </TouchableOpacity>

                {/* Share as PDF */}
                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('pdf')}
                  disabled={exportLoading}
                >
                  <Ionicons name="document-text" size={40} color={theme.primary} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as PDF
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Professional formatted PDF report
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.mutedText} />
                </TouchableOpacity>

                {/* Share as File */}
                <TouchableOpacity
                  style={[styles.exportOption, { backgroundColor: theme.elevatedCard }]}
                  onPress={() => handleShareOption('file')}
                  disabled={exportLoading}
                >
                  <Ionicons name="document" size={40} color={theme.warning} />
                  <View style={styles.exportOptionText}>
                    <Text style={[styles.exportOptionTitle, { color: theme.text }]}>
                      Share as File
                    </Text>
                    <Text style={[styles.exportOptionDesc, { color: theme.mutedText }]}>
                      Plain text file (.txt)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.mutedText} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShareModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
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
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  exportOptions: {
    gap: 12,
    marginBottom: 16,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 16,
  },
  exportOptionText: {
    flex: 1,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exportOptionDesc: {
    fontSize: 13,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
