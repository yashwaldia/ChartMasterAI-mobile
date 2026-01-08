// components/ui/ErrorBanner.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
  autoClose?: number;
}

export default function ErrorBanner({
  message,
  onClose,
  autoClose = 5000,
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(true);
  const theme = Colors.dark;

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoClose);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  if (!visible || !message) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      exiting={FadeOutUp.duration(300)}
      style={[
        styles.container,
        {
          backgroundColor: theme.error + '15',
          borderColor: theme.error,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={22} color={theme.error} />
      </View>
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={3}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        activeOpacity={0.6}
      >
        <Ionicons name="close" size={20} color={theme.mutedText} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
