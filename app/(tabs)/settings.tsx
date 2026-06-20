import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getGithubRepo, setGithubRepo, checkGithubAndOta, fetchAndApplyUpdate, getCurrentVersion, clearIgnoredVersion, setIgnoredVersion, UpdateStatus, UpdateInfo } from '../../lib/updates';

export default function SettingsScreen() {
  const [repo, setRepo] = useState('');
  const [savedRepo, setSavedRepo] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const [githubInfo, setGithubInfo] = useState<UpdateInfo | null>(null);
  const [otaAvailable, setOtaAvailable] = useState(false);

  useEffect(() => {
    getGithubRepo().then((r) => {
      if (r) {
        setRepo(r);
        setSavedRepo(r);
      }
    });
  }, []);

  const handleSave = async () => {
    const trimmed = repo.trim();
    if (!trimmed || !trimmed.includes('/')) {
      Alert.alert('Error', 'Enter as: username/repo-name');
      return;
    }

    await setGithubRepo(trimmed);
    setSavedRepo(trimmed);
    Alert.alert('Saved', 'Update source configured');
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    setLastCheckResult(null);
    setUpdateStatus('idle');
    setGithubInfo(null);
    setOtaAvailable(false);

    try {
      const result = await checkGithubAndOta();
      setGithubInfo(result.github);
      setOtaAvailable(result.otaAvailable);

      if (result.otaAvailable && result.github) {
        setLastCheckResult(`v${result.github.version} ready to install`);
        Alert.alert(
          'Update Available',
          `Version ${result.github.version} is ready to install.\n\n${result.github.releaseNotes || 'No release notes.'}\n\nYour plant data will not be affected.`,
          [
            {
              text: 'Skip This Version',
              style: 'cancel',
              onPress: async () => { await setIgnoredVersion(result.github!.version); },
            },
            { text: 'Later', style: 'cancel' },
            {
              text: 'Update Now',
              onPress: async () => {
                const applied = await fetchAndApplyUpdate((s) => setUpdateStatus(s));
                if (!applied) {
                  Alert.alert('Notice', 'No pending update found. The app will check again on next launch.');
                }
              },
            },
          ]
        );
      } else if (result.otaAvailable && !result.github) {
        setLastCheckResult('Update ready to install');
        Alert.alert(
          'Update Available',
          'A new version is ready to install.\n\nYour plant data will not be affected.',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Update Now',
              onPress: async () => {
                const applied = await fetchAndApplyUpdate((s) => setUpdateStatus(s));
                if (!applied) {
                  Alert.alert('Notice', 'No pending update found. The app will check again on next launch.');
                }
              },
            },
          ]
        );
      } else if (result.github && !result.otaAvailable) {
        setLastCheckResult(`v${result.github.version} on GitHub (not yet available)`);
        Alert.alert(
          'Update Found',
          `Version ${result.github.version} is on GitHub but not yet available for in-app install.\n\nCheck back after the update is published.`,
          [{ text: 'OK' }]
        );
      } else {
        setLastCheckResult('Up to date');
      }
    } catch {
      setLastCheckResult('Check failed');
    } finally {
      setIsChecking(false);
    }
  };

  const handleClearIgnored = async () => {
    await clearIgnoredVersion();
    Alert.alert('Done', 'Skipped versions will show again');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.cardTitle}>App</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{getCurrentVersion()}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cloud-upload" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Updates</Text>
        </View>

        <Text style={styles.hint}>
          Enter your GitHub repo to check for releases. Updates are downloaded and applied instantly within the app — your plant data is never lost.
        </Text>

        <Text style={styles.label}>GitHub Repo</Text>
        <TextInput
          value={repo}
          onChangeText={setRepo}
          placeholder="username/repo-name"
          placeholderTextColor="#4b5563"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.button, styles.saveBtn, repo === savedRepo && styles.disabledBtn]}
            disabled={repo === savedRepo}
          >
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCheckNow}
            style={[styles.button, styles.checkBtn, (!savedRepo || isChecking) && styles.disabledBtn]}
            disabled={!savedRepo || isChecking}
          >
            <Text style={styles.btnText}>{isChecking ? 'Checking...' : 'Check'}</Text>
          </TouchableOpacity>
        </View>

        {lastCheckResult && (
          <View style={styles.result}>
            <Text style={[styles.resultText, lastCheckResult === 'Up to date' ? styles.good : styles.warn]}>
              {lastCheckResult}
            </Text>
          </View>
        )}

        {(updateStatus === 'downloading' || updateStatus === 'restarting') && (
          <View style={styles.statusContainer}>
            <Ionicons name="sync" size={16} color="#22c55e" style={{ marginRight: 8 }} />
            <Text style={styles.statusText}>
              {updateStatus === 'downloading' ? 'Downloading update...' : 'Restarting with update...'}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handleClearIgnored} style={styles.link}>
          <Text style={styles.linkText}>Show skipped versions</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 24, marginBottom: 16 },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#fff', fontWeight: '600', fontSize: 14, marginBottom: 8 },
  value: { color: '#fff', fontSize: 14 },
  hint: { color: '#9ca3af', fontSize: 13, marginBottom: 12 },
  input: { backgroundColor: '#1f2937', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#374151', fontSize: 14, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtn: { backgroundColor: '#22c55e' },
  checkBtn: { backgroundColor: '#3b82f6' },
  disabledBtn: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  result: { marginTop: 12, padding: 12, backgroundColor: '#1f2937', borderRadius: 8 },
  resultText: { fontSize: 13 },
  good: { color: '#22c55e' },
  warn: { color: '#f59e0b' },
  statusContainer: { marginTop: 12, padding: 12, backgroundColor: '#1f2937', borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#22c55e', fontSize: 13 },
  link: { marginTop: 8, paddingVertical: 4 },
  linkText: { color: '#3b82f6', fontSize: 13 },
});
