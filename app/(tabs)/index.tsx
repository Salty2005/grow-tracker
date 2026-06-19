import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import PlantCard from '../../components/PlantCard';

export default function HomeScreen() {
  const router = useRouter();
  const plants = useStore((state) => state.plants);
  const careLogs = useStore((state) => state.careLogs);
  const environmentReadings = useStore((state) => state.environmentReadings);

  const activePlants = plants.filter((p) => p.stage !== 'complete');
  const completedPlants = plants.filter((p) => p.stage === 'complete');
  const recentLogs = careLogs.slice(-5).reverse();

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.content}>
            {plants.length > 0 && (
              <View style={styles.statsBar}>
                <View style={styles.statItem}><Text style={[styles.statValue, { color: '#4ade80' }]}>{activePlants.length}</Text><Text style={styles.statLabel}>Active</Text></View>
                <View style={styles.statItem}><Text style={[styles.statValue, { color: '#60a5fa' }]}>{careLogs.length}</Text><Text style={styles.statLabel}>Care Logs</Text></View>
                <View style={styles.statItem}><Text style={[styles.statValue, { color: '#c084fc' }]}>{environmentReadings.length}</Text><Text style={styles.statLabel}>Readings</Text></View>
                <View style={styles.statItem}><Text style={[styles.statValue, { color: '#fbbf24' }]}>{completedPlants.length}</Text><Text style={styles.statLabel}>Harvested</Text></View>
              </View>
            )}

            <TouchableOpacity onPress={() => router.push('/add-plant')} style={styles.addButton} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add New Plant</Text>
            </TouchableOpacity>

            {plants.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={64} color="#1f2937" />
                <Text style={styles.emptyTitle}>No plants yet</Text>
                <Text style={styles.emptySubtitle}>Start your grow journey by adding your first plant</Text>
              </View>
            ) : (
              <>
                {activePlants.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Active Plants</Text>
                    {activePlants.map((plant) => (
                      <PlantCard key={plant.id} plant={plant} onPress={() => router.push(`/plant/${plant.id}`)} />
                    ))}
                  </>
                )}
                {completedPlants.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Completed ({completedPlants.length})</Text>
                    {completedPlants.map((plant) => (
                      <PlantCard key={plant.id} plant={plant} onPress={() => router.push(`/plant/${plant.id}`)} />
                    ))}
                  </>
                )}
              </>
            )}

            {recentLogs.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Activity</Text>
                {recentLogs.map((log) => {
                  const plant = plants.find((p) => p.id === log.plantId);
                  return (
                    <View key={log.id} style={styles.activityItem}>
                      <View style={styles.activityRow}>
                        <Text style={styles.activityType}>{log.type.replace('_', ' ')}</Text>
                        <Text style={styles.activityPlant}>{plant?.name}</Text>
                      </View>
                      {log.details ? <Text style={styles.activityDetails} numberOfLines={1}>{log.details}</Text> : null}
                    </View>
                  );
                })}
              </>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937' },
  statItem: { alignItems: 'center' },
  statValue: { fontWeight: 'bold', fontSize: 20 },
  statLabel: { color: '#6b7280', fontSize: 12 },
  addButton: { backgroundColor: '#16a34a', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { color: '#6b7280', fontSize: 18, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { color: '#4b5563', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  activityItem: { backgroundColor: '#111827', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937' },
  activityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activityType: { color: '#fff', fontWeight: '600', fontSize: 14, textTransform: 'capitalize', flex: 1 },
  activityPlant: { color: '#6b7280', fontSize: 12 },
  activityDetails: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
});
