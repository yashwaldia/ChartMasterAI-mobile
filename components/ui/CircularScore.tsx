// components/ui/CircularScore.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
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
  size = 120,
  strokeWidth = 10,
  color,
}: CircularScoreProps) {
  const theme = Colors.dark;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  const getScoreColor = () => {
    if (color) return color;
    if (value >= 70) return theme.success;
    if (value >= 40) return theme.warning;
    return theme.error;
  };

  const scoreColor = getScoreColor();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    let startValue = 0;
    const duration = 1200;
    const startTime = Date.now();

    const updateNumber = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuad);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="glowGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor={scoreColor} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.primary}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.1}
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
          <Text style={[styles.valueText, { color: scoreColor }]}>{displayValue}</Text>
        </View>

        {/* Glow Effect */}
        <View
          style={[
            styles.glowEffect,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              shadowColor: scoreColor,
            },
          ]}
        />
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
    gap: 8,
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
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
});
