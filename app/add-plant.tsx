import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { GrowthStage, LightSchedule } from '../types';
import { GROWTH_STAGES } from '../constants';

export default function AddPlantScreen() {
  const router = useRouter();
  const addPlant = useStore((state) => state.addPlant);
  const [name, setName] = useState('');
  const [strain, setStrain] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('unknown');
  const [stage, setStage] = useState<GrowthStage>('seed');
  const [lightSchedule, setLightSchedule] = useState<LightSchedule>('18/6');
  const [medium, setMedium] = useState('soil');
  const [potSize, setPotSize] = useState('3 gallon');
  const [geneticType, setGeneticType] = useState<'photoperiod' | 'autoflower'>('photoperiod');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter a plant name');
    if (!strain.trim()) return Alert.alert('Error', 'Please enter a strain name');
    await addPlant({ name: name.trim(), strain: strain.trim(), gender, stage, startDate: new Date().toISOString(), expectedHarvestDate: null, lightSchedule, medium, potSize, geneticType, notes: notes.trim() });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Plant Name *</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g., Plant #1, Blue Dream" placeholderTextColor="#6b7280" style={styles.input} />

        <Text style={styles.label}>Strain *</Text>
        <TextInput value={strain} onChangeText={setStrain} placeholder="e.g., Blue Dream, Northern Lights" placeholderTextColor="#6b7280" style={styles.input} />

        <Text style={styles.label}>Genetic Type</Text>
        <View style={styles.row}>
          {(['photoperiod', 'autoflower'] as const).map((t) => (
            <TouchableOpacity key={t} onPress={() => setGeneticType(t)} style={[styles.halfButton, geneticType === t && styles.activeGreen]}>
              <Text style={[styles.halfButtonText, geneticType === t && styles.activeText]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}>
          {(['female', 'male', 'unknown'] as const).map((g) => (
            <TouchableOpacity key={g} onPress={() => setGender(g)} style={[styles.halfButton, { marginRight: 8 }, gender === g && (g === 'female' ? styles.activePink : g === 'male' ? styles.activeBlue : styles.activeGray)]}>
              <Text style={[styles.halfButtonText, gender === g && styles.activeText]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Current Stage</Text>
        <View style={styles.chipRow}>
          {GROWTH_STAGES.filter((s) => s !== 'complete').map((s) => (
            <TouchableOpacity key={s} onPress={() => setStage(s)} style={[styles.chip, stage === s && styles.activeGreen]}>
              <Text style={[styles.chipText, stage === s && styles.activeText]}>{s.replace('-', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Light Schedule</Text>
        <View style={styles.chipRow}>
          {(['18/6', '12/12', '20/4', '24/0', 'auto'] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setLightSchedule(s)} style={[styles.chip, lightSchedule === s && styles.activeGreen]}>
              <Text style={[styles.chipText, lightSchedule === s && styles.activeText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Growing Medium</Text>
        <View style={styles.chipRow}>
          {['soil', 'coco', 'hydro', 'soil-less', 'rdwc', 'dwc'].map((m) => (
            <TouchableOpacity key={m} onPress={() => setMedium(m)} style={[styles.chip, medium === m && styles.activeGreen]}>
              <Text style={[styles.chipText, medium === m && styles.activeText]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Pot Size</Text>
        <View style={styles.chipRow}>
          {['1 gallon', '3 gallon', '5 gallon', '7 gallon', '10 gallon', 'fabric pot'].map((s) => (
            <TouchableOpacity key={s} onPress={() => setPotSize(s)} style={[styles.chip, potSize === s && styles.activeGreen]}>
              <Text style={[styles.chipText, potSize === s && styles.activeText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Any additional notes..." placeholderTextColor="#6b7280" multiline numberOfLines={4} textAlignVertical="top" style={[styles.input, { minHeight: 100 }]} />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Add Plant</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 15 },
  row: { flexDirection: 'row', marginBottom: 4 },
  halfButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', marginRight: 8, alignItems: 'center' },
  halfButtonText: { color: '#9ca3af', fontWeight: '600', fontSize: 14, textTransform: 'capitalize' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', marginRight: 8, marginBottom: 8 },
  chipText: { color: '#9ca3af', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  activeGreen: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activePink: { backgroundColor: '#db2777', borderColor: '#db2777' },
  activeBlue: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  activeGray: { backgroundColor: '#4b5563', borderColor: '#4b5563' },
  activeText: { color: '#fff' },
  saveButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, marginTop: 16, marginBottom: 32 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
