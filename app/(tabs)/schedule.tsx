import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NUTRIENT_SCHEDULES, ENVIRONMENT_TARGETS, WATERING_GUIDELINES, PH_GUIDELINES, DEFOLIATION_GUIDE, GROWTH_STAGES } from '../../constants';

type ScheduleTab = 'nutrients' | 'environment' | 'watering' | 'defoliation';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('nutrients');
  const [selectedStage, setSelectedStage] = useState('vegetative');

  const tabs: { key: ScheduleTab; label: string }[] = [
    { key: 'nutrients', label: 'Nutrients' },
    { key: 'environment', label: 'Environment' },
    { key: 'watering', label: 'Watering' },
    { key: 'defoliation', label: 'Defoliation' },
  ];

  const filteredNutrients = NUTRIENT_SCHEDULES.filter((n) => n.stage === selectedStage);
  const envTarget = ENVIRONMENT_TARGETS.find((e) => e.stage === selectedStage);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageBar} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
        {GROWTH_STAGES.filter((s) => s !== 'complete').map((stage) => (
          <TouchableOpacity key={stage} onPress={() => setSelectedStage(stage)} style={[styles.stageChip, selectedStage === stage && styles.stageChipActive]}>
            <Text style={[styles.stageChipText, selectedStage === stage && styles.stageChipTextActive]}>{stage.replace('-', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'nutrients' && (
          <>
            <Text style={styles.title}>{selectedStage.replace('-', ' ')} Nutrients</Text>
            {filteredNutrients.length === 0 ? (
              <View style={styles.card}><Text style={styles.emptyText}>No specific nutrient schedule for this stage.</Text></View>
            ) : (
              filteredNutrients.map((schedule, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>Week {schedule.week}</Text>
                  {schedule.nutrients.map((n, j) => (
                    <View key={j} style={styles.nutrientItem}>
                      <View style={[styles.nutrientIcon, { backgroundColor: '#a855f720' }]}><Ionicons name="flask" size={14} color="#a855f7" /></View>
                      <View style={{ flex: 1 }}><Text style={styles.nutrientName}>{n.type}</Text><Text style={styles.nutrientAmount}>{n.amount}</Text></View>
                      <Text style={styles.nutrientFreq}>{n.frequency}</Text>
                    </View>
                  ))}
                  <View style={styles.nutrientMeta}>
                    <Text style={styles.metaText}>Soil pH: {schedule.phRange}</Text>
                    <Text style={styles.metaText}>Coco pH: {schedule.cocoPhRange}</Text>
                    <Text style={styles.metaText}>EC: {schedule.ecRange}</Text>
                    <Text style={styles.metaText}>PPM: {schedule.ppmRange}</Text>
                  </View>
                  {schedule.notes ? <Text style={styles.notes}>{schedule.notes}</Text> : null}
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'environment' && (
          <>
            <Text style={styles.title}>{selectedStage.replace('-', ' ')} Environment</Text>
            {envTarget ? (
              <View style={styles.card}>
                <View style={styles.envGrid}>
                  <View style={styles.envItem}><Text style={styles.envLabel}>DAY TEMP</Text><Text style={styles.envValue}>{envTarget.tempDay}</Text></View>
                  <View style={styles.envItem}><Text style={styles.envLabel}>NIGHT TEMP</Text><Text style={styles.envValue}>{envTarget.tempNight}</Text></View>
                  <View style={styles.envItem}><Text style={styles.envLabel}>HUMIDITY</Text><Text style={styles.envValue}>{envTarget.humidity}</Text></View>
                  <View style={styles.envItem}><Text style={styles.envLabel}>VPD</Text><Text style={styles.envValue}>{envTarget.vpd}</Text></View>
                  <View style={styles.envItem}><Text style={styles.envLabel}>LIGHT HOURS</Text><Text style={styles.envValue}>{envTarget.lightHours}h</Text></View>
                  <View style={styles.envItem}><Text style={styles.envLabel}>INTENSITY</Text><Text style={styles.envValue}>{envTarget.lightIntensity}</Text></View>
                </View>
                {envTarget.notes ? <Text style={styles.notes}>{envTarget.notes}</Text> : null}
              </View>
            ) : <View style={styles.card}><Text style={styles.emptyText}>No environment data for this stage.</Text></View>}
          </>
        )}

        {activeTab === 'watering' && (
          <>
            <Text style={styles.title}>Watering Guidelines</Text>
            <View style={styles.card}><Ionicons name="water" size={20} color="#3b82f6" /><Text style={styles.cardTitle}>Seedling</Text><Text style={styles.description}>{WATERING_GUIDELINES.seedling}</Text></View>
            <View style={styles.card}><Ionicons name="water" size={20} color="#22c55e" /><Text style={styles.cardTitle}>Vegetative</Text><Text style={styles.description}>{WATERING_GUIDELINES.vegetative}</Text></View>
            <View style={styles.card}><Ionicons name="water" size={20} color="#a855f7" /><Text style={styles.cardTitle}>Flowering</Text><Text style={styles.description}>{WATERING_GUIDELINES.flowering}</Text></View>
            <View style={styles.card}><Ionicons name="water" size={20} color="#f59e0b" /><Text style={styles.cardTitle}>Late Flowering / Flush</Text><Text style={styles.description}>{WATERING_GUIDELINES.lateFlowering}</Text></View>
            <Text style={[styles.title, { marginTop: 16 }]}>pH Guidelines</Text>
            <View style={styles.card}>
              <View style={styles.envGrid}>
                <View style={styles.envItem}><Text style={styles.envLabel}>SOIL pH</Text><Text style={styles.envValue}>{PH_GUIDELINES.soil.min}-{PH_GUIDELINES.soil.max}</Text><Text style={styles.envSubtext}>Optimal: {PH_GUIDELINES.soil.optimal}</Text></View>
                <View style={styles.envItem}><Text style={styles.envLabel}>COCO pH</Text><Text style={styles.envValue}>{PH_GUIDELINES.coco.min}-{PH_GUIDELINES.coco.max}</Text><Text style={styles.envSubtext}>Optimal: {PH_GUIDELINES.coco.optimal}</Text></View>
                <View style={styles.envItem}><Text style={styles.envLabel}>HYDRO pH</Text><Text style={styles.envValue}>{PH_GUIDELINES.hydro.min}-{PH_GUIDELINES.hydro.max}</Text><Text style={styles.envSubtext}>Optimal: {PH_GUIDELINES.hydro.optimal}</Text></View>
              </View>
              <Text style={styles.notes}>{PH_GUIDELINES.notes}</Text>
            </View>
          </>
        )}

        {activeTab === 'defoliation' && (
          <>
            <Text style={styles.title}>Defoliation Guide</Text>
            <View style={styles.card}><Text style={styles.cardTitle}>Vegetative Stage</Text><Text style={styles.description}>{DEFOLIATION_GUIDE.vegetative}</Text></View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Flowering Stage</Text>
              {Object.entries(DEFOLIATION_GUIDE.flowering).map(([week, guide]) => (
                <View key={week} style={{ marginBottom: 12 }}>
                  <Text style={styles.envLabel}>{week.replace('_', ' ').replace(/(\d)/g, ' $1').toUpperCase()}</Text>
                  <Text style={styles.description}>{guide}</Text>
                </View>
              ))}
            </View>
            <View style={styles.card}><Text style={styles.cardTitle}>General Rules</Text><Text style={styles.description}>{DEFOLIATION_GUIDE.notes}</Text></View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  stageBar: { borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  stageChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginRight: 8, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937' },
  stageChipActive: { backgroundColor: '#16a34a' },
  stageChipText: { color: '#9ca3af', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  stageChipTextActive: { color: '#fff' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1f2937', paddingHorizontal: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#22c55e' },
  tabText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#4ade80' },
  scroll: { flex: 1 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16, textTransform: 'capitalize' },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
  description: { color: '#d1d5db', fontSize: 14 },
  notes: { color: '#9ca3af', fontSize: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1f2937', fontStyle: 'italic' },
  emptyText: { color: '#6b7280', fontSize: 14 },
  nutrientItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f2937', borderRadius: 8, padding: 12, marginBottom: 8 },
  nutrientIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  nutrientName: { color: '#fff', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  nutrientAmount: { color: '#9ca3af', fontSize: 11 },
  nutrientFreq: { color: '#6b7280', fontSize: 11 },
  nutrientMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1f2937' },
  metaText: { color: '#6b7280', fontSize: 10, marginRight: 12 },
  envGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  envItem: { marginBottom: 12, width: '48%' },
  envLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  envValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  envSubtext: { color: '#4ade80', fontSize: 10 },
  whenBox: { backgroundColor: '#1f2937', borderRadius: 8, padding: 12, marginTop: 8 },
  whenLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  whenValue: { color: '#fff', fontSize: 14 },
  effectText: { color: '#4ade80', fontSize: 14 },
  infoBlock: { marginBottom: 8 },
  infoLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { color: '#d1d5db', fontSize: 13 },
});
