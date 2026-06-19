import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store';
import { calculateVPD } from '../lib/storage';

export default function EnvironmentScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const router = useRouter();
  const addEnvironmentReading = useStore((s) => s.addEnvironmentReading);
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [co2, setCo2] = useState('');
  const [lightIntensity, setLightIntensity] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [soilPh, setSoilPh] = useState('');
  const [waterPh, setWaterPh] = useState('');
  const [waterPpm, setWaterPpm] = useState('');
  const [runoffPpm, setRunoffPpm] = useState('');
  const [notes, setNotes] = useState('');

  const temp = parseFloat(temperature);
  const hum = parseFloat(humidity);
  const vpd = temp && hum ? calculateVPD((temp - 32) * (5 / 9), hum) : null;

  const handleSave = async () => {
    if (!plantId || !temperature || !humidity) return;
    await addEnvironmentReading({
      plantId, temperature: parseFloat(temperature), humidity: parseFloat(humidity), vpd,
      co2: co2 ? parseFloat(co2) : null, lightIntensity: lightIntensity ? parseFloat(lightIntensity) : null,
      soilMoisture: soilMoisture ? parseFloat(soilMoisture) : null, soilPh: soilPh ? parseFloat(soilPh) : null,
      waterPh: waterPh ? parseFloat(waterPh) : null, waterPpm: waterPpm ? parseFloat(waterPpm) : null,
      runoffPpm: runoffPpm ? parseFloat(runoffPpm) : null, notes: notes.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Temperature (F) *</Text>
        <TextInput value={temperature} onChangeText={setTemperature} placeholder="e.g., 75" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
        <Text style={styles.hint}>Target: 70-85F in veg, 65-80F in flower</Text>

        <Text style={styles.label}>Humidity (%) *</Text>
        <TextInput value={humidity} onChangeText={setHumidity} placeholder="e.g., 55" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
        <Text style={styles.hint}>Target: 40-70% in veg, 40-55% in flower</Text>

        {vpd ? (
          <View style={styles.vpdBox}>
            <Text style={styles.vpdLabel}>CALCULATED VPD</Text>
            <Text style={styles.vpdValue}>{vpd} kPa</Text>
            <Text style={styles.vpdStatus}>
              {vpd < 0.8 ? 'Too low - increase temp or decrease humidity' : vpd > 1.4 ? 'Too high - decrease temp or increase humidity' : 'Good range'}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>CO2 (PPM)</Text>
        <TextInput value={co2} onChangeText={setCo2} placeholder="e.g., 800" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />
        <Text style={styles.hint}>Normal: 400-500. Supplemented: 800-1500</Text>

        <Text style={styles.label}>Light Intensity (PPFD)</Text>
        <TextInput value={lightIntensity} onChangeText={setLightIntensity} placeholder="e.g., 600" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />

        <Text style={styles.label}>Soil Moisture (%)</Text>
        <TextInput value={soilMoisture} onChangeText={setSoilMoisture} placeholder="e.g., 45" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.smallLabel}>Water pH</Text>
            <TextInput value={waterPh} onChangeText={setWaterPh} placeholder="6.5" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.smallLabel}>Water PPM</Text>
            <TextInput value={waterPpm} onChangeText={setWaterPpm} placeholder="400" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.smallLabel}>Runoff PPM</Text>
            <TextInput value={runoffPpm} onChangeText={setRunoffPpm} placeholder="500" placeholderTextColor="#6b7280" keyboardType="number-pad" style={styles.input} />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.smallLabel}>Soil pH</Text>
            <TextInput value={soilPh} onChangeText={setSoilPh} placeholder="6.5" placeholderTextColor="#6b7280" keyboardType="decimal-pad" style={styles.input} />
          </View>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Any observations..." placeholderTextColor="#6b7280" multiline numberOfLines={3} textAlignVertical="top" style={[styles.input, { minHeight: 80 }]} />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Reading</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8, marginTop: 12 },
  smallLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 15 },
  hint: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', marginBottom: 4 },
  halfInput: { flex: 1, marginRight: 8 },
  vpdBox: { backgroundColor: '#111827', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 4 },
  vpdLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  vpdValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  vpdStatus: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  saveButton: { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 16, marginTop: 16, marginBottom: 32 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
