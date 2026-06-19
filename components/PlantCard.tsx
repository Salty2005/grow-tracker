import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plant } from '../types';
import { STAGE_COLORS } from '../constants';
import { calculateDaysSince } from '../lib/storage';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
}

export default function PlantCard({ plant, onPress }: PlantCardProps) {
  const days = calculateDaysSince(plant.startDate);
  const stageColor = STAGE_COLORS[plant.stage] || '#6b7280';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: stageColor + '20' }]}>
          <Ionicons name="leaf" size={24} color={stageColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.strain}>{plant.strain}</Text>
        </View>
        <View style={styles.right}>
          <View style={[styles.badge, { backgroundColor: stageColor + '20' }]}>
            <Text style={[styles.badgeText, { color: stageColor }]}>
              {plant.stage.replace('-', ' ')}
            </Text>
          </View>
          <Text style={styles.days}>Day {days}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color="#9ca3af" />
          <Text style={styles.footerText}>{plant.lightSchedule} light</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="cube-outline" size={14} color="#9ca3af" />
          <Text style={styles.footerText}>{plant.potSize}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="water-outline" size={14} color="#9ca3af" />
          <Text style={styles.footerText}>{plant.medium}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1f2937' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  strain: { color: '#9ca3af', fontSize: 14 },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  days: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  footer: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1f2937' },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  footerText: { color: '#9ca3af', fontSize: 12, marginLeft: 4 },
});
