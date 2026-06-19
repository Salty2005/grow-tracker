import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GrowthStage, StageGuide, EnvironmentTarget, NutrientSchedule } from '../types';
import { STAGE_COLORS, STAGE_GUIDES, ENVIRONMENT_TARGETS, NUTRIENT_SCHEDULES } from '../constants';

interface StageDetailCardProps {
  stage: GrowthStage;
  showGuide?: boolean;
  showEnvironment?: boolean;
  showNutrients?: boolean;
}

export default function StageDetailCard({ stage, showGuide = true, showEnvironment = true, showNutrients = true }: StageDetailCardProps) {
  const guide = STAGE_GUIDES.find((g) => g.stage === stage);
  const env = ENVIRONMENT_TARGETS.find((e) => e.stage === stage);
  const nutrients = NUTRIENT_SCHEDULES.filter((n) => n.stage === stage);
  const color = STAGE_COLORS[stage] || '#6b7280';

  return (
    <View style={styles.container}>
      {guide && showGuide && (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: color + '20' }]}>
              <Ionicons name="information-circle" size={16} color={color} />
            </View>
            <Text style={styles.headerTitle}>{guide.name}</Text>
            <Text style={styles.duration}>{guide.duration}</Text>
          </View>
          <Text style={styles.description}>{guide.description}</Text>
          <Text style={styles.sectionTitle}>KEY TASKS</Text>
          {guide.keyTasks.map((task, i) => (
            <View key={i} style={styles.taskRow}>
              <Ionicons name="checkmark-circle" size={14} color={color} />
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))}
          {guide.commonProblems.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 12 }]}>COMMON PROBLEMS</Text>
              {guide.commonProblems.map((p, i) => (
                <View key={i} style={styles.taskRow}>
                  <Ionicons name="alert-circle" size={14} color="#f59e0b" />
                  <Text style={styles.taskText}>{p}</Text>
                </View>
              ))}
            </>
          )}
          {guide.tips.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 12 }]}>PRO TIPS</Text>
              {guide.tips.map((tip, i) => (
                <View key={i} style={styles.taskRow}>
                  <Ionicons name="bulb" size={14} color="#22c55e" />
                  <Text style={styles.taskText}>{tip}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}
      {env && showEnvironment && (
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="thermometer" size={16} color="#3b82f6" />
            <Text style={[styles.headerTitle, { marginLeft: 8 }]}>Environment Targets</Text>
          </View>
          <View style={styles.envGrid}>
            <View style={styles.envItem}><Text style={styles.envLabel}>DAY TEMP</Text><Text style={styles.envValue}>{env.tempDay}</Text></View>
            <View style={styles.envItem}><Text style={styles.envLabel}>NIGHT TEMP</Text><Text style={styles.envValue}>{env.tempNight}</Text></View>
            <View style={styles.envItem}><Text style={styles.envLabel}>HUMIDITY</Text><Text style={styles.envValue}>{env.humidity}</Text></View>
            <View style={styles.envItem}><Text style={styles.envLabel}>VPD</Text><Text style={styles.envValue}>{env.vpd}</Text></View>
            <View style={styles.envItem}><Text style={styles.envLabel}>LIGHT</Text><Text style={styles.envValue}>{env.lightHours}h - {env.lightIntensity}</Text></View>
          </View>
          {env.notes ? <Text style={styles.notes}>{env.notes}</Text> : null}
        </View>
      )}
      {nutrients.length > 0 && showNutrients && (
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="flask" size={16} color="#a855f7" />
            <Text style={[styles.headerTitle, { marginLeft: 8 }]}>Nutrient Schedule</Text>
          </View>
          {nutrients.map((schedule, i) => (
            <View key={i} style={[styles.nutrientWeek, i > 0 && { marginTop: 12 }]}>
              <Text style={styles.weekLabel}>Week {schedule.week}</Text>
              {schedule.nutrients.map((n, j) => (
                <View key={j} style={styles.nutrientRow}>
                  <View style={[styles.nutrientDot, { backgroundColor: '#a855f7' }]} />
                  <Text style={styles.nutrientText}>{n.type}: {n.amount} ({n.frequency})</Text>
                </View>
              ))}
              <View style={styles.nutrientMeta}>
                <Text style={styles.nutrientMetaText}>pH: {schedule.phRange}</Text>
                <Text style={styles.nutrientMetaText}>EC: {schedule.ecRange}</Text>
                <Text style={styles.nutrientMetaText}>PPM: {schedule.ppmRange}</Text>
              </View>
              {schedule.notes ? <Text style={[styles.notes, { fontStyle: 'italic' }]}>{schedule.notes}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  duration: { color: '#6b7280', fontSize: 12, marginLeft: 'auto' },
  description: { color: '#d1d5db', fontSize: 14, marginBottom: 12 },
  sectionTitle: { color: '#fff', fontWeight: '600', fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  taskText: { color: '#d1d5db', fontSize: 12, flex: 1, marginLeft: 8 },
  envGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  envItem: { marginBottom: 8, width: '48%' },
  envLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  envValue: { color: '#fff', fontSize: 14 },
  notes: { color: '#9ca3af', fontSize: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1f2937' },
  nutrientWeek: {},
  weekLabel: { color: '#9ca3af', fontSize: 12, marginBottom: 8 },
  nutrientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  nutrientDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  nutrientText: { color: '#d1d5db', fontSize: 12 },
  nutrientMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  nutrientMetaText: { color: '#6b7280', fontSize: 10, marginRight: 12 },
});
