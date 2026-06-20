import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store';
import { SnapshotPhoto } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { generateId } from '../lib/storage';

export default function GrowthSnapshotScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const router = useRouter();
  const addGrowthSnapshot = useStore((s) => s.addGrowthSnapshot);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [nodeCount, setNodeCount] = useState('');
  const [leafCount, setLeafCount] = useState('');
  const [budCount, setBudCount] = useState('');
  const [budDensity, setBudDensity] = useState<'airy' | 'medium' | 'dense' | null>(null);
  const [trichomeStatus, setTrichomeStatus] = useState<'clear' | 'cloudy' | 'amber' | 'mixed' | null>(null);
  const [pistilStatus, setPistilStatus] = useState<'white' | 'turning' | 'dark' | null>(null);
  const [photos, setPhotos] = useState<SnapshotPhoto[]>([]);
  const [photoTitle, setPhotoTitle] = useState('');
  const [notes, setNotes] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: SnapshotPhoto = {
        id: generateId(),
        uri: result.assets[0].uri,
        title: photoTitle.trim() || `Photo ${photos.length + 1}`,
      };
      setPhotos([...photos, newPhoto]);
      setPhotoTitle('');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: SnapshotPhoto = {
        id: generateId(),
        uri: result.assets[0].uri,
        title: photoTitle.trim() || `Photo ${photos.length + 1}`,
      };
      setPhotos([...photos, newPhoto]);
      setPhotoTitle('');
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  const handleSave = async () => {
    if (!plantId) return;
    await addGrowthSnapshot({
      plantId, height: height ? parseFloat(height) : null, width: width ? parseFloat(width) : null,
      nodeCount: nodeCount ? parseInt(nodeCount) : null, leafCount: leafCount ? parseInt(leafCount) : null,
      budCount: budCount ? parseInt(budCount) : null, budDensity, trichomeStatus, pistilStatus,
      photos, notes: notes.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Height (inches)</Text>
            <TextInput value={height} onChangeText={setHeight} placeholder="12" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Width (inches)</Text>
            <TextInput value={width} onChangeText={setWidth} placeholder="18" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Node Count</Text>
            <TextInput value={nodeCount} onChangeText={setNodeCount} placeholder="8" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Leaf Count</Text>
            <TextInput value={leafCount} onChangeText={setLeafCount} placeholder="24" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />
          </View>
        </View>

        <Text style={styles.label}>Bud Count</Text>
        <TextInput value={budCount} onChangeText={setBudCount} placeholder="e.g., 12" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />

        <Text style={styles.label}>Bud Density</Text>
        <View style={styles.row}>
          {(['airy', 'medium', 'dense'] as const).map((d) => (
            <TouchableOpacity key={d} onPress={() => setBudDensity(budDensity === d ? null : d)} style={[styles.halfButton, budDensity === d && styles.activeGreen]}>
              <Text style={[styles.halfButtonText, budDensity === d && styles.activeText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Trichome Status</Text>
        <View style={styles.chipRow}>
          {(['clear', 'cloudy', 'amber', 'mixed'] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setTrichomeStatus(trichomeStatus === s ? null : s)} style={[styles.chip, trichomeStatus === s && styles.activeGreen]}>
              <Text style={[styles.chipText, trichomeStatus === s && styles.activeText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {trichomeStatus ? (
          <Text style={styles.hint}>
            {trichomeStatus === 'clear' && 'Too early - not ready'}
            {trichomeStatus === 'cloudy' && 'Peak THC - energetic effects'}
            {trichomeStatus === 'amber' && 'THC degrading to CBN - more body effects'}
            {trichomeStatus === 'mixed' && 'Balanced mix of effects'}
          </Text>
        ) : null}

        <Text style={styles.label}>Pistil Status</Text>
        <View style={styles.row}>
          {(['white', 'turning', 'dark'] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setPistilStatus(pistilStatus === s ? null : s)} style={[styles.halfButton, pistilStatus === s && styles.activeGreen]}>
              <Text style={[styles.halfButtonText, pistilStatus === s && styles.activeText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {pistilStatus ? (
          <Text style={styles.hint}>
            {pistilStatus === 'white' && 'Still developing - not ready'}
            {pistilStatus === 'turning' && 'Approaching harvest window'}
            {pistilStatus === 'dark' && 'Past prime - harvest soon'}
          </Text>
        ) : null}

        <Text style={styles.label}>Photos</Text>
        <View style={styles.photoSection}>
          <TextInput
            value={photoTitle}
            onChangeText={setPhotoTitle}
            placeholder="Photo title (optional)"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />
          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={pickImage} style={[styles.photoButton, styles.galleryButton]} activeOpacity={0.8}>
              <Text style={styles.photoButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={[styles.photoButton, styles.cameraButton]} activeOpacity={0.8}>
              <Text style={styles.photoButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <View style={styles.photosContainer}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoTitle} numberOfLines={1}>{photo.title}</Text>
                    <TouchableOpacity onPress={() => removePhoto(photo.id)} style={styles.removePhotoButton}>
                      <Text style={styles.removePhotoText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Observations about growth..." placeholderTextColor="#6b7280" multiline numberOfLines={3} textAlignVertical="top" style={[styles.input, { minHeight: 80 }]} />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Snapshot</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 15 },
  hint: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', marginBottom: 4 },
  halfInput: { flex: 1, marginRight: 8 },
  halfButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', alignItems: 'center', marginRight: 8 },
  halfButtonText: { color: '#9ca3af', fontWeight: '600', fontSize: 14, textTransform: 'capitalize' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', marginRight: 8, marginBottom: 8 },
  chipText: { color: '#9ca3af', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  activeGreen: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activeText: { color: '#fff' },
  photoSection: { marginTop: 8 },
  photoButtons: { flexDirection: 'row', marginBottom: 12 },
  photoButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 8 },
  galleryButton: { backgroundColor: '#2563eb' },
  cameraButton: { backgroundColor: '#7c3aed' },
  photoButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  photosContainer: { marginTop: 8 },
  photoItem: { flexDirection: 'row', backgroundColor: '#111827', borderRadius: 12, padding: 8, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937' },
  photoThumbnail: { width: 60, height: 60, borderRadius: 8 },
  photoInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  photoTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  removePhotoButton: { marginTop: 4 },
  removePhotoText: { color: '#ef4444', fontSize: 12 },
  saveButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, marginTop: 16, marginBottom: 32 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
