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

  const pickFromGallery = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImages(prev => [...prev, uri]);
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickFromCamera = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to take photos.'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImages(prev => [...prev, uri]);
      }
    } catch (error) {
      console.error('Camera picker error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const isUploadDisabled = loading || images.length >= maxImages;

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            {
              borderColor: theme.border,
              backgroundColor: theme.elevatedCard,
            },
            isUploadDisabled && styles.uploadButtonDisabled,
          ]}
          onPress={pickFromGallery}
          disabled={isUploadDisabled}
          activeOpacity={0.6}
        >
          <Ionicons name="images-outline" size={32} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.text }]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            {
              borderColor: theme.primary,
              backgroundColor: theme.primary + '10',
            },
            isUploadDisabled && styles.uploadButtonDisabled,
          ]}
          onPress={pickFromCamera}
          disabled={isUploadDisabled}
          activeOpacity={0.6}
        >
          <Ionicons name="camera-outline" size={32} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.primary }]}>Camera</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={20} color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.mutedText }]}>
            Processing...
          </Text>
        </View>
      )}

      <View style={[styles.limitBadge, { backgroundColor: theme.primary + '15' }]}>
        <Text style={[styles.limitText, { color: theme.primary }]}>
          {images.length}/{maxImages} selected
        </Text>
      </View>

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
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={28} color={theme.error} />
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  uploadButton: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  uploadButtonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  limitBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  limitText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewItem: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  previewImage: {
    width: 108,
    height: 108,
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 999,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  previewLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
