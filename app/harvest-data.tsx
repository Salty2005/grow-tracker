import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store';

export default function HarvestDataScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const router = useRouter();
  const addHarvestData = useStore((s) => s.addHarvestData);
  const [wetWeight, setWetWeight] = useState('');
  const [dryWeight, setDryWeight] = useState('');
  const [trimWeight, setTrimWeight] = useState('');
  const [cureWeight, setCureWeight] = useState('');
  const [dryingDays, setDryingDays] = useState('');
  const [curingDays, setCuringDays] = useState('');
  const [dryingTemp, setDryingTemp] = useState('');
  const [dryingHumidity, setDryingHumidity] = useState('');
  const [cureJarCount, setCureJarCount] = useState('');
  const [qualityRating, setQualityRating] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!plantId) return;
    await addHarvestData({
      plantId, wetWeight: wetWeight ? parseFloat(wetWeight) : null, dryWeight: dryWeight ? parseFloat(dryWeight) : null,
      trimWeight: trimWeight ? parseFloat(trimWeight) : null, cureWeight: cureWeight ? parseFloat(cureWeight) : null,
      dryingDays: dryingDays ? parseInt(dryingDays) : null, curingDays: curingDays ? parseInt(curingDays) : null,
      dryingTemp: dryingTemp ? parseFloat(dryingTemp) : null, dryingHumidity: dryingHumidity ? parseFloat(dryingHumidity) : null,
      cureJarCount: cureJarCount ? parseInt(cureJarCount) : null, qualityRating: qualityRating ? parseInt(qualityRating) : null,
      notes: notes.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Harvest Weights (grams)</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}><Text style={styles.label}>Wet Weight</Text><TextInput value={wetWeight} onChangeText={setWetWeight} placeholder="500" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
          <View style={styles.halfInput}><Text style={styles.label}>Dry Weight</Text><TextInput value={dryWeight} onChangeText={setDryWeight} placeholder="125" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfInput}><Text style={styles.label}>Trim Weight</Text><TextInput value={trimWeight} onChangeText={setTrimWeight} placeholder="25" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
          <View style={styles.halfInput}><Text style={styles.label}>Cure Weight</Text><TextInput value={cureWeight} onChangeText={setCureWeight} placeholder="115" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
        </View>

        {dryWeight && wetWeight ? (
          <View style={styles.ratioBox}>
            <Text style={styles.ratioLabel}>DRY-TO-WET RATIO</Text>
            <Text style={styles.ratioValue}>{((parseFloat(dryWeight) / parseFloat(wetWeight)) * 100).toFixed(1)}%</Text>
            <Text style={styles.ratioHint}>Target: 20-25% for good dry</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Drying & Curing</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}><Text style={styles.label}>Drying Days</Text><TextInput value={dryingDays} onChangeText={setDryingDays} placeholder="10" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} /></View>
          <View style={styles.halfInput}><Text style={styles.label}>Curing Days</Text><TextInput value={curingDays} onChangeText={setCuringDays} placeholder="30" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfInput}><Text style={styles.label}>Drying Temp (F)</Text><TextInput value={dryingTemp} onChangeText={setDryingTemp} placeholder="62" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
          <View style={styles.halfInput}><Text style={styles.label}>Drying Humidity</Text><TextInput value={dryingHumidity} onChangeText={setDryingHumidity} placeholder="60" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /></View>
        </View>

        <Text style={styles.label}>Cure Jar Count</Text>
        <TextInput value={cureJarCount} onChangeText={setCureJarCount} placeholder="4" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />

        <Text style={styles.label}>Quality Rating</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity key={num} onPress={() => setQualityRating(qualityRating === String(num) ? '' : String(num))} style={[styles.ratingButton, qualityRating === String(num) && styles.activeGreen]}>
              <Text style={[styles.ratingText, qualityRating === String(num) && styles.activeText]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Harvest observations, trim notes..." placeholderTextColor="#6b7280" multiline numberOfLines={4} textAlignVertical="top" style={[styles.input, { minHeight: 100 }]} />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Harvest Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 15 },
  row: { flexDirection: 'row', marginBottom: 4 },
  halfInput: { flex: 1, marginRight: 8 },
  ratioBox: { backgroundColor: '#111827', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  ratioLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  ratioValue: { color: '#4ade80', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  ratioHint: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  ratingRow: { flexDirection: 'row' },
  ratingButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 4, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937' },
  ratingText: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },
  activeGreen: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activeText: { color: '#fff' },
  saveButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, marginTop: 16, marginBottom: 32 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
