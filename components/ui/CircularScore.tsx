// components/ui/CircularScore.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Colors from '../../constants/Colors';

interface CircularScoreProps {
  label: string;
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularScore({
  label,
  value,
  size = 140,
  strokeWidth = 12,
  color,
}: CircularScoreProps) {
  const theme = Colors.dark;
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Determine color based on value if not provided
  const getScoreColor = () => {
    if (color) return color;
    if (value >= 70) return theme.success; // Green
    if (value >= 40) return theme.warning; // Yellow/Orange
    return theme.error; // Red
  };

  const scoreColor = getScoreColor();

  // Circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  // Interpolate the stroke dash offset for animation
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.border}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.2}
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        {/* Center Value */}
        <View style={styles.centerContent}>
          <Text style={[styles.valueText, { color: scoreColor }]}>{value}</Text>
        </View>
      </View>

      {/* Label */}
      <Text style={[styles.labelText, { color: theme.mutedText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
