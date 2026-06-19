import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GrowthStage } from '../types';
import { STAGE_COLORS } from '../constants';

interface StageBadgeProps {
  stage: GrowthStage;
  size?: 'sm' | 'md' | 'lg';
}

export default function StageBadge({ stage, size = 'md' }: StageBadgeProps) {
  const color = STAGE_COLORS[stage] || '#6b7280';
  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
    md: { paddingHorizontal: 12, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20', paddingHorizontal: s.paddingHorizontal, paddingVertical: s.paddingVertical }]}>
      <Text style={[styles.text, { color, fontSize: s.fontSize }]}>
        {stage.replace('-', ' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 12, alignSelf: 'flex-start' },
  text: { fontWeight: '600', textTransform: 'capitalize' },
});
