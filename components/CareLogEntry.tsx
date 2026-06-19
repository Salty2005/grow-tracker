import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CareLog } from '../types';
import { CARE_TYPES } from '../constants';
import { formatDateTime } from '../lib/storage';

const CARE_COLORS: Record<string, string> = {
  water: '#3b82f6', nutrients: '#a855f7', ph_adjust: '#f59e0b', prune: '#ef4444',
  top: '#f97316', lst: '#06b6d4', scrog: '#10b981', defoliate: '#84cc16',
  flush: '#6366f1', repot: '#78716c', ipm: '#ec4899', other: '#6b7280',
};

interface CareLogEntryProps { log: CareLog; onDelete?: () => void }

export default function CareLogEntry({ log, onDelete }: CareLogEntryProps) {
  const careType = CARE_TYPES.find((c) => c.value === log.type);
  const color = CARE_COLORS[log.type] || '#6b7280';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={(careType?.icon as any) || 'ellipsis-horizontal-outline'} size={18} color={color} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>{careType?.label || log.type}</Text>
          {log.nutrientName && (
            <Text style={styles.nutrient}> - {log.nutrientName}{log.nutrientAmount ? ` (${log.nutrientAmount})` : ''}</Text>
          )}
        </View>
        {log.details ? <Text style={styles.details} numberOfLines={1}>{log.details}</Text> : null}
        <View style={styles.metaRow}>
          {log.waterAmount && <Text style={styles.meta}>{log.waterAmount}</Text>}
          {log.phLevel && <Text style={styles.meta}>pH {log.phLevel}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{formatDateTime(log.createdAt)}</Text>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={{ marginTop: 4 }}>
            <Ionicons name="trash-outline" size={14} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111827', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937', flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  content: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { color: '#fff', fontWeight: '600', fontSize: 14 },
  nutrient: { color: '#9ca3af', fontSize: 12, marginLeft: 4 },
  details: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  meta: { color: '#6b7280', fontSize: 10, marginRight: 12 },
  right: { alignItems: 'flex-end' },
  time: { color: '#6b7280', fontSize: 10 },
});
