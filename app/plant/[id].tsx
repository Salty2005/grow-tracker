import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { GROWTH_STAGES, STAGE_COLORS, STAGE_GUIDES } from '../../constants';
import { calculateDaysSince, formatDate } from '../../lib/storage';
import StageBadge from '../../components/StageBadge';
import CareLogEntry from '../../components/CareLogEntry';
import EnvironmentCard from '../../components/EnvironmentCard';
import GrowthSnapshotCard from '../../components/GrowthSnapshotCard';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plants = useStore((s) => s.plants);
  const updatePlantStage = useStore((s) => s.updatePlantStage);
  const updatePlantStartDate = useStore((s) => s.updatePlantStartDate);
  const deletePlant = useStore((s) => s.deletePlant);
  const careLogs = useStore((s) => s.getPlantCareLogs(id || ''));
  const environmentReadings = useStore((s) => s.getPlantEnvironmentReadings(id || ''));
  const growthSnapshots = useStore((s) => s.getPlantGrowthSnapshots(id || ''));
  const removePhotoFromSnapshot = useStore((s) => s.removePhotoFromSnapshot);
  const harvestData = useStore((s) => s.getPlantHarvestData(id || ''));
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'environment' | 'growth'>('overview');
  const [showStagePicker, setShowStagePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState('');

  const plant = plants.find((p) => p.id === id);
  if (!plant) return <View style={styles.center}><Text style={{ color: '#6b7280' }}>Plant not found</Text></View>;

  const days = calculateDaysSince(plant.startDate);
  const guide = STAGE_GUIDES.find((g) => g.stage === plant.stage);
  const stageColor = STAGE_COLORS[plant.stage] || '#6b7280';

  const handleDelete = () => {
    Alert.alert('Delete Plant', `Are you sure you want to delete "${plant.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deletePlant(plant.id); router.back(); } },
    ]);
  };

  const handleChangeStartDate = () => {
    const currentDate = new Date(plant.startDate);
    const dateStr = currentDate.toISOString().split('T')[0];
    setDateInput(dateStr);
    setShowDatePicker(true);
  };

  const handleSaveStartDate = async () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateInput)) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      Alert.alert('Error', 'Invalid date');
      return;
    }

    if (date > new Date()) {
      Alert.alert('Error', 'Planting date cannot be in the future');
      return;
    }

    await updatePlantStartDate(plant.id, date.toISOString());
    setShowDatePicker(false);
    Alert.alert('Success', 'Planting date updated');
  };

  const tabs = [{ key: 'overview', label: 'Overview' }, { key: 'care', label: 'Care' }, { key: 'environment', label: 'Environment' }, { key: 'growth', label: 'Growth' }] as const;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={[styles.headerIcon, { backgroundColor: stageColor + '20' }]}><Ionicons name="leaf" size={28} color={stageColor} /></View>
          <View style={{ flex: 1 }}><Text style={styles.plantName}>{plant.name}</Text><Text style={styles.plantStrain}>{plant.strain}</Text></View>
          <TouchableOpacity onPress={handleDelete}><Ionicons name="trash-outline" size={20} color="#ef4444" /></TouchableOpacity>
        </View>
        <View style={styles.headerMeta}>
          <StageBadge stage={plant.stage} />
          <Text style={styles.daysText}>Day {days}</Text>
          {plant.gender !== 'unknown' && <Text style={styles.genderText}>({plant.gender})</Text>}
        </View>
        <View style={styles.headerDetails}>
          <View style={styles.detailItem}><Ionicons name="time-outline" size={14} color="#9ca3af" /><Text style={styles.detailText}>{plant.lightSchedule}</Text></View>
          <View style={styles.detailItem}><Ionicons name="cube-outline" size={14} color="#9ca3af" /><Text style={styles.detailText}>{plant.potSize}</Text></View>
          <View style={styles.detailItem}><Ionicons name="water-outline" size={14} color="#9ca3af" /><Text style={styles.detailText}>{plant.medium}</Text></View>
        </View>
        <TouchableOpacity onPress={() => setShowStagePicker(!showStagePicker)} style={styles.stagePicker}>
          <Ionicons name="git-branch-outline" size={18} color={stageColor} />
          <Text style={styles.stagePickerText}>Change Stage: <Text style={{ fontWeight: '600', textTransform: 'capitalize' }}>{plant.stage.replace('-', ' ')}</Text></Text>
          <Ionicons name={showStagePicker ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
        </TouchableOpacity>
        {showStagePicker && (
          <View style={styles.stagePickerGrid}>
            {GROWTH_STAGES.map((s) => (
              <TouchableOpacity key={s} onPress={async () => { await updatePlantStage(plant.id, s); setShowStagePicker(false); }} style={[styles.chip, plant.stage === s && styles.activeGreen]}>
                <Text style={[styles.chipText, plant.stage === s && styles.activeText]}>{s.replace('-', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/care-log', params: { plantId: plant.id } })} style={[styles.actionButton, { backgroundColor: '#2563eb' }]}>
          <Ionicons name="water" size={20} color="#fff" /><Text style={styles.actionText}>Log Care</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: '/environment', params: { plantId: plant.id } })} style={[styles.actionButton, { backgroundColor: '#7c3aed' }]}>
          <Ionicons name="thermometer" size={20} color="#fff" /><Text style={styles.actionText}>Environment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: '/growth-snapshot', params: { plantId: plant.id } })} style={[styles.actionButton, { backgroundColor: '#16a34a' }]}>
          <Ionicons name="trending-up" size={20} color="#fff" /><Text style={styles.actionText}>Snapshot</Text>
        </TouchableOpacity>
        {(plant.stage === 'late-flowering' || plant.stage === 'harvest') && (
          <TouchableOpacity onPress={() => router.push({ pathname: '/harvest-data', params: { plantId: plant.id } })} style={[styles.actionButton, { backgroundColor: '#d97706' }]}>
            <Ionicons name="cut" size={20} color="#fff" /><Text style={styles.actionText}>Harvest</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {activeTab === 'overview' && (
          <>
            {guide && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{guide.name}</Text>
                <Text style={styles.description}>{guide.description}</Text>
                {guide.keyTasks.slice(0, 3).map((task, i) => (
                  <View key={i} style={styles.taskRow}><Ionicons name="checkmark-circle" size={14} color={stageColor} /><Text style={styles.taskText}>{task}</Text></View>
                ))}
              </View>
            )}
            {plant.notes && <View style={styles.card}><Text style={styles.cardTitle}>Notes</Text><Text style={styles.description}>{plant.notes}</Text></View>}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Stats</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Started</Text>
                <View style={styles.statWithValue}>
                  <Text style={styles.statValue}>{formatDate(plant.startDate)}</Text>
                  <TouchableOpacity onPress={handleChangeStartDate} style={styles.editDateButton}>
                    <Ionicons name="pencil" size={12} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.statRow}><Text style={styles.statLabel}>Days Growing</Text><Text style={styles.statValue}>{days}</Text></View>
              <View style={styles.statRow}><Text style={styles.statLabel}>Type</Text><Text style={styles.statValue}>{plant.geneticType}</Text></View>
              <View style={styles.statRow}><Text style={styles.statLabel}>Gender</Text><Text style={styles.statValue}>{plant.gender}</Text></View>
            </View>
          </>
        )}
        {activeTab === 'care' && (
          careLogs.length === 0
            ? <View style={styles.emptyState}><Ionicons name="water-outline" size={48} color="#1f2937" /><Text style={styles.emptyText}>No care logs yet</Text></View>
            : careLogs.map((log) => <CareLogEntry key={log.id} log={log} />)
        )}
        {activeTab === 'environment' && (
          environmentReadings.length === 0
            ? <View style={styles.emptyState}><Ionicons name="thermometer-outline" size={48} color="#1f2937" /><Text style={styles.emptyText}>No environment readings yet</Text></View>
            : environmentReadings.map((r) => <EnvironmentCard key={r.id} reading={r} />)
        )}
        {activeTab === 'growth' && (
          <>
            {growthSnapshots.length === 0
              ? <View style={styles.emptyState}><Ionicons name="trending-up-outline" size={48} color="#1f2937" /><Text style={styles.emptyText}>No growth snapshots yet</Text></View>
              : growthSnapshots.map((s) => (
                  <GrowthSnapshotCard 
                    key={s.id} 
                    snapshot={s} 
                    onRemovePhoto={(photoId) => removePhotoFromSnapshot(s.id, photoId)}
                  />
                ))
            }
            {harvestData && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Harvest Data</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {harvestData.wetWeight && <View style={{ width: '48%', marginBottom: 8 }}><Text style={styles.statLabel}>WET WEIGHT</Text><Text style={styles.statValue}>{harvestData.wetWeight}g</Text></View>}
                  {harvestData.dryWeight && <View style={{ width: '48%', marginBottom: 8 }}><Text style={styles.statLabel}>DRY WEIGHT</Text><Text style={styles.statValue}>{harvestData.dryWeight}g</Text></View>}
                  {harvestData.cureWeight && <View style={{ width: '48%', marginBottom: 8 }}><Text style={styles.statLabel}>CURE WEIGHT</Text><Text style={styles.statValue}>{harvestData.cureWeight}g</Text></View>}
                  {harvestData.qualityRating && <View style={{ width: '48%', marginBottom: 8 }}><Text style={styles.statLabel}>QUALITY</Text><Text style={styles.statValue}>{harvestData.qualityRating}/10</Text></View>}
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Planting Date</Text>
            <Text style={styles.modalHint}>Enter date in YYYY-MM-DD format</Text>
            <TextInput
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6b7280"
              style={styles.dateInput}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(false)} 
                style={styles.modalCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSaveStartDate} 
                style={styles.modalSave}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  plantName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  plantStrain: { color: '#9ca3af', fontSize: 14 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  daysText: { color: '#6b7280', fontSize: 14, marginLeft: 12 },
  genderText: { color: '#4b5563', fontSize: 14, marginLeft: 8 },
  headerDetails: { flexDirection: 'row' },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { color: '#9ca3af', fontSize: 12, marginLeft: 4 },
  stagePicker: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#111827', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1f2937' },
  stagePickerText: { color: '#fff', fontSize: 14, flex: 1, marginLeft: 8 },
  stagePickerGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  actions: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  actionButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginHorizontal: 4 },
  actionText: { color: '#fff', fontSize: 11, marginTop: 4 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1f2937', paddingHorizontal: 16 },
  tab: { paddingVertical: 12, marginRight: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#22c55e' },
  tabText: { color: '#6b7280', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#4ade80' },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  description: { color: '#d1d5db', fontSize: 14 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, marginTop: 4 },
  taskText: { color: '#d1d5db', fontSize: 12, marginLeft: 8, flex: 1 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#6b7280', fontSize: 14 },
  statValue: { color: '#fff', fontSize: 14 },
  statWithValue: { flexDirection: 'row', alignItems: 'center' },
  editDateButton: { marginLeft: 8, padding: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#6b7280', marginTop: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', marginRight: 8, marginBottom: 8 },
  chipText: { color: '#9ca3af', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  activeGreen: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activeText: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1f2937', borderRadius: 16, padding: 24, width: '80%', borderWidth: 1, borderColor: '#374151' },
  modalTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  modalHint: { color: '#9ca3af', fontSize: 13, marginBottom: 16 },
  dateInput: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#374151', fontSize: 16, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#374151' },
  modalCancelText: { color: '#9ca3af', fontSize: 14, fontWeight: '600' },
  modalSave: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#22c55e' },
  modalSaveText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
