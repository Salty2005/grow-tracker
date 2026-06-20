import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkGithubAndOta, fetchAndApplyUpdate, UpdateInfo, UpdateStatus, getCurrentVersion } from '../lib/updates';

interface UpdateBannerProps {
  onDismiss?: () => void;
}

export default function UpdateBanner({ onDismiss }: UpdateBannerProps) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [otaAvailable, setOtaAvailable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    async function check() {
      const result = await checkGithubAndOta();

      setOtaAvailable(result.otaAvailable);

      if (result.otaAvailable) {
        setUpdateInfo(result.github || { version: 'new', releaseNotes: 'A new update is ready to install.' });
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
    check();
  }, []);

  const handleDismiss = () => {
    if (status === 'downloading' || status === 'restarting') return;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  const handleUpdate = async () => {
    const result = await fetchAndApplyUpdate((s) => setStatus(s));
    if (!result && status !== 'error') {
      setStatus('error');
    }
  };

  if (!visible || !updateInfo) return null;

  const isWorking = status === 'downloading' || status === 'restarting';

  const statusText: Record<UpdateStatus, string> = {
    idle: 'Update',
    checking: 'Checking...',
    downloading: 'Downloading update...',
    restarting: 'Restarting...',
    completed: 'Done!',
    error: 'Update failed',
    'not-available': 'Update',
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-up-circle" size={24} color="#22c55e" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.version}>v{getCurrentVersion()} → v{updateInfo.version}</Text>
          {updateInfo.releaseNotes ? (
            <Text style={styles.notes} numberOfLines={2}>{updateInfo.releaseNotes}</Text>
          ) : null}
        </View>
      </View>

      {status === 'downloading' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Downloading update...</Text>
        </View>
      )}

      {status === 'restarting' && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>App is restarting with the update...</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Update failed. Check your connection and try again.</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleDismiss}
          style={[styles.dismissButton, isWorking && styles.disabledButton]}
          disabled={isWorking}
        >
          <Text style={styles.dismissText}>Later</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUpdate}
          style={[styles.updateButton, isWorking && styles.disabledButton]}
          disabled={isWorking}
        >
          <Text style={styles.updateText}>{statusText[status]}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  version: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  notes: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dismissButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  dismissText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  updateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#22c55e',
  },
  updateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
