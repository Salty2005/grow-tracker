import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GrowthSnapshot, SnapshotPhoto } from '../types';
import { formatDateTime } from '../lib/storage';

interface GrowthSnapshotCardProps {
  snapshot: GrowthSnapshot;
  onRemovePhoto?: (photoId: string) => void;
}

export default function GrowthSnapshotCard({ snapshot, onRemovePhoto }: GrowthSnapshotCardProps) {
  const handleRemovePhoto = (photo: SnapshotPhoto) => {
    if (!onRemovePhoto) return;
    
    Alert.alert(
      'Remove Photo',
      `Remove "${photo.title}" from this snapshot?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => onRemovePhoto(photo.id)
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.metricsGrid}>
        {snapshot.height && (
          <View style={styles.metricItem}>
            <Text style={styles.metricValueGreen}>{snapshot.height}"</Text>
            <Text style={styles.metricLabel}>Height</Text>
          </View>
        )}
        {snapshot.width && (
          <View style={styles.metricItem}>
            <Text style={styles.metricValueGreen}>{snapshot.width}"</Text>
            <Text style={styles.metricLabel}>Width</Text>
          </View>
        )}
        {snapshot.nodeCount && (
          <View style={styles.metricItem}>
            <Text style={styles.metricValueGreen}>{snapshot.nodeCount}</Text>
            <Text style={styles.metricLabel}>Nodes</Text>
          </View>
        )}
        {snapshot.leafCount && (
          <View style={styles.metricItem}>
            <Text style={styles.metricValueGreen}>{snapshot.leafCount}</Text>
            <Text style={styles.metricLabel}>Leaves</Text>
          </View>
        )}
        {snapshot.budCount && (
          <View style={styles.metricItem}>
            <Text style={styles.metricValuePurple}>{snapshot.budCount}</Text>
            <Text style={styles.metricLabel}>Buds</Text>
          </View>
        )}
      </View>
      <View style={styles.tagsRow}>
        {snapshot.budDensity && <View style={styles.tag}><Text style={styles.tagText}>Density: {snapshot.budDensity}</Text></View>}
        {snapshot.trichomeStatus && <View style={styles.tag}><Text style={styles.tagText}>Trichomes: {snapshot.trichomeStatus}</Text></View>}
        {snapshot.pistilStatus && <View style={styles.tag}><Text style={styles.tagText}>Pistils: {snapshot.pistilStatus}</Text></View>}
      </View>

      {snapshot.photos && snapshot.photos.length > 0 && (
        <View style={styles.photosSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
            {snapshot.photos.map((photo) => (
              <View key={photo.id} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <Text style={styles.photoTitle} numberOfLines={1}>{photo.title}</Text>
                {onRemovePhoto && (
                  <TouchableOpacity 
                    onPress={() => handleRemovePhoto(photo)} 
                    style={styles.removeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={22} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {snapshot.notes ? <Text style={styles.notes}>{snapshot.notes}</Text> : null}
      <Text style={styles.time}>{formatDateTime(snapshot.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricItem: { alignItems: 'center', marginBottom: 8, width: '30%' },
  metricValueGreen: { color: '#4ade80', fontWeight: 'bold', fontSize: 18 },
  metricValuePurple: { color: '#c084fc', fontWeight: 'bold', fontSize: 18 },
  metricLabel: { color: '#6b7280', fontSize: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  tag: { backgroundColor: '#1f2937', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8, marginBottom: 4 },
  tagText: { color: '#d1d5db', fontSize: 10 },
  photosSection: { marginTop: 12 },
  photosScroll: { marginBottom: 8 },
  photoContainer: { marginRight: 12, alignItems: 'center', position: 'relative' },
  photo: { width: 100, height: 100, borderRadius: 8 },
  photoTitle: { color: '#9ca3af', fontSize: 10, marginTop: 4, maxWidth: 100 },
  removeButton: { position: 'absolute', top: -6, right: -6, backgroundColor: '#0a0a0a', borderRadius: 11 },
  notes: { color: '#9ca3af', fontSize: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1f2937' },
  time: { color: '#4b5563', fontSize: 10, marginTop: 8 },
});
