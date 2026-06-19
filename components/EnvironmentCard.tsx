import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnvironmentReading } from '../types';
import { formatDateTime } from '../lib/storage';

interface EnvironmentCardProps { reading: EnvironmentReading; compact?: boolean }

export default function EnvironmentCard({ reading, compact = false }: EnvironmentCardProps) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <View style={styles.metric}><Ionicons name="thermometer-outline" size={16} color="#ef4444" /><Text style={styles.compactText}>{reading.temperature}F</Text></View>
        <View style={styles.metric}><Ionicons name="water-outline" size={16} color="#3b82f6" /><Text style={styles.compactText}>{reading.humidity}%</Text></View>
        {reading.vpd && <View style={styles.metric}><Ionicons name="speedometer-outline" size={16} color="#f59e0b" /><Text style={styles.compactText}>{reading.vpd}</Text></View>}
      </View>
    );
  }

  const metrics = [
    { icon: 'thermometer-outline', label: 'Temp', value: `${reading.temperature}F`, color: '#ef4444' },
    { icon: 'water-outline', label: 'Humidity', value: `${reading.humidity}%`, color: '#3b82f6' },
    ...(reading.vpd ? [{ icon: 'speedometer-outline', label: 'VPD', value: `${reading.vpd} kPa`, color: '#f59e0b' }] : []),
    ...(reading.soilMoisture != null ? [{ icon: 'leaf-outline', label: 'Soil', value: `${reading.soilMoisture}%`, color: '#22c55e' }] : []),
    ...(reading.waterPh ? [{ icon: 'bandage-outline', label: 'pH', value: `${reading.waterPh}`, color: '#a855f7' }] : []),
    ...(reading.waterPpm ? [{ icon: 'fitness-outline', label: 'PPM', value: `${reading.waterPpm}`, color: '#06b6d4' }] : []),
  ];

  return (
    <View style={styles.card}>
      <View style={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <View key={i} style={styles.metricItem}>
            <Ionicons name={m.icon as any} size={20} color={m.color} />
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
      {reading.notes ? <Text style={styles.notes}>{reading.notes}</Text> : null}
      <Text style={styles.time}>{formatDateTime(reading.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  compact: { backgroundColor: '#111827', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1f2937', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metric: { flexDirection: 'row', alignItems: 'center' },
  compactText: { color: '#fff', fontSize: 14, marginLeft: 4 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricItem: { alignItems: 'center', marginBottom: 8, width: '30%' },
  metricValue: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginTop: 4 },
  metricLabel: { color: '#6b7280', fontSize: 10 },
  notes: { color: '#9ca3af', fontSize: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1f2937' },
  time: { color: '#4b5563', fontSize: 10, marginTop: 8 },
});
