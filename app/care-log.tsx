import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store';
import { CareType } from '../types';
import { CARE_TYPES, NUTRIENT_TYPES } from '../constants';

export default function CareLogScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const router = useRouter();
  const addCareLog = useStore((s) => s.addCareLog);
  const [careType, setCareType] = useState<CareType>('water');
  const [details, setDetails] = useState('');
  const [nutrientName, setNutrientName] = useState('');
  const [nutrientAmount, setNutrientAmount] = useState('');
  const [waterAmount, setWaterAmount] = useState('');
  const [phLevel, setPhLevel] = useState('');

  const handleSave = async () => {
    if (!plantId) return;
    await addCareLog({ plantId, type: careType, details: details.trim(), nutrientName: nutrientName.trim() || null, nutrientAmount: nutrientAmount.trim() || null, waterAmount: waterAmount.trim() || null, phLevel: phLevel ? parseFloat(phLevel) : null });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Activity Type *</Text>
        <View style={styles.chipRow}>
          {CARE_TYPES.map((ct) => (
            <TouchableOpacity key={ct.value} onPress={() => setCareType(ct.value)} style={[styles.chip, careType === ct.value && styles.activeGreen]}>
              <Text style={[styles.chipText, careType === ct.value && styles.activeText]}>{ct.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(careType === 'water' || careType === 'flush') && (
          <><Text style={styles.label}>Water Amount</Text><TextInput value={waterAmount} onChangeText={setWaterAmount} placeholder="e.g., 500ml, 1 gallon" placeholderTextColor="#6b7280" style={styles.input} /></>
        )}

        {careType === 'nutrients' && (
          <>
            <Text style={styles.label}>Nutrient Type</Text>
            <View style={styles.chipRow}>
              {NUTRIENT_TYPES.map((nt) => (
                <TouchableOpacity key={nt.value} onPress={() => setNutrientName(nt.label)} style={[styles.chip, nutrientName === nt.label && { backgroundColor: '#7c3aed', borderColor: '#7c3aed' }]}>
                  <Text style={[styles.chipText, nutrientName === nt.label && styles.activeText]}>{nt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Amount/Strength</Text>
            <TextInput value={nutrientAmount} onChangeText={setNutrientAmount} placeholder="e.g., 2ml/L, 50% strength" placeholderTextColor="#6b7280" style={styles.input} />
          </>
        )}

        {(careType === 'water' || careType === 'ph_adjust' || careType === 'nutrients') && (
          <><Text style={styles.label}>pH Level</Text><TextInput value={phLevel} onChangeText={setPhLevel} placeholder="e.g., 6.5" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} /><Text style={styles.hint}>Target: 6.0-7.0 (soil) / 5.5-6.5 (hydro)</Text></>
        )}

        <Text style={styles.label}>Details / Notes</Text>
        <TextInput value={details} onChangeText={setDetails} placeholder="Any additional notes..." placeholderTextColor="#6b7280" multiline numberOfLines={4} textAlignVertical="top" style={[styles.input, { minHeight: 100 }]} />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Log Activity</Text>
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#111827', marginRight: 8, marginBottom: 8 },
  chipText: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  activeGreen: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  activeText: { color: '#fff' },
  saveButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, marginTop: 16, marginBottom: 32 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
