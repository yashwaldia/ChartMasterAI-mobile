// components/ui/ImagePicker.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ImagePickerProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
}

export default function ImagePickerComponent({
  images,
  setImages,
  maxImages = 4,
}: ImagePickerProps) {
  const [loading, setLoading] = useState(false);
  const theme = Colors.dark;

  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],  // New SDK 52+ syntax - plain string array
        allowsEditing: false,    // No crop, true-size input
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImages(prev => [...prev, uri]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {/* Upload Area */}
      <TouchableOpacity
        style={[
          styles.uploadArea,
          {
            borderColor: theme.border,
            backgroundColor: theme.elevatedCard,
          },
          images.length >= maxImages && styles.uploadAreaDisabled,
        ]}
        onPress={pickImage}
        disabled={loading || images.length >= maxImages}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons
            name={loading ? 'hourglass-outline' : 'images-outline'}
            size={32}
            color={theme.primary}
          />
        </View>
        <Text style={[styles.uploadText, { color: theme.text }]}>
          {loading ? 'Processing...' : 'Tap to upload images'}
        </Text>
        <Text style={[styles.uploadSubtext, { color: theme.mutedText }]}>
          Supports multi-timeframe charts
        </Text>
        <View style={[styles.limitBadge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.limitText, { color: theme.primary }]}>
            {images.length} selected
          </Text>
        </View>
      </TouchableOpacity>

      {/* Image Previews */}
      {images.length > 0 && (
        <View style={styles.previewGrid}>
          {images.map((uri, index) => (
            <View
              key={index}
              style={[
                styles.previewItem,
                { backgroundColor: theme.elevatedCard },
              ]}
            >
              <Image
                source={{ uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={24} color={theme.error} />
              </TouchableOpacity>
              <View style={styles.previewOverlay}>
                <Text style={styles.previewLabel}>Chart {index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadAreaDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  uploadSubtext: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  limitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  limitText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  previewItem: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: 104,
    height: 104,
    borderRadius: 14,
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 999,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  previewLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
