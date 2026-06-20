import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

const GITHUB_REPO_KEY = '@grow_github_repo';
const IGNORED_VERSION_KEY = '@grow_ignored_version';

export function getCurrentVersion(): string {
  return Constants.expoConfig?.version || '1.0.0';
}

export interface UpdateInfo {
  version: string;
  releaseNotes: string;
}

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'restarting' | 'completed' | 'error' | 'not-available';

export async function getGithubRepo(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(GITHUB_REPO_KEY);
  } catch {
    return null;
  }
}

export async function setGithubRepo(repo: string): Promise<void> {
  await AsyncStorage.setItem(GITHUB_REPO_KEY, repo);
}

export async function getIgnoredVersion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(IGNORED_VERSION_KEY);
  } catch {
    return null;
  }
}

export async function setIgnoredVersion(version: string): Promise<void> {
  await AsyncStorage.setItem(IGNORED_VERSION_KEY, version);
}

export async function clearIgnoredVersion(): Promise<void> {
  await AsyncStorage.removeItem(IGNORED_VERSION_KEY);
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  return 0;
}

function cleanVersionTag(tag: string): string {
  return tag.replace(/^v/i, '').trim();
}

export async function checkGithubReleaseInfo(): Promise<UpdateInfo | null> {
  try {
    const repo = await getGithubRepo();
    if (!repo || !repo.includes('/')) return null;

    const ignoredVersion = await getIgnoredVersion();
    const currentVersion = getCurrentVersion();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }
    );
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();

    const version = cleanVersionTag(data.tag_name || '');
    if (!version) return null;

    if (compareVersions(version, currentVersion) <= 0) return null;

    if (ignoredVersion === version) return null;

    return {
      version,
      releaseNotes: data.body || '',
    };
  } catch {
    return null;
  }
}

export async function checkForOtaUpdate(): Promise<boolean> {
  try {
    if (__DEV__) return false;

    const update = await Updates.checkForUpdateAsync();
    return update.isAvailable;
  } catch {
    return false;
  }
}

export async function fetchAndApplyUpdate(
  onStatusChange?: (status: UpdateStatus) => void
): Promise<boolean> {
  try {
    if (__DEV__) return false;

    onStatusChange?.('checking');
    const update = await Updates.checkForUpdateAsync();

    if (!update.isAvailable) {
      onStatusChange?.('not-available');
      return false;
    }

    onStatusChange?.('downloading');
    const downloadedUpdate = await Updates.fetchUpdateAsync();

    if (downloadedUpdate.isNew) {
      onStatusChange?.('restarting');
      await Updates.reloadAsync();
      return true;
    }

    onStatusChange?.('not-available');
    return false;
  } catch (error) {
    console.error('OTA update failed:', error);
    onStatusChange?.('error');
    return false;
  }
}

export async function checkGithubAndOta(): Promise<{ github: UpdateInfo | null; otaAvailable: boolean }> {
  const [githubInfo, otaAvailable] = await Promise.all([
    checkGithubReleaseInfo(),
    checkForOtaUpdate(),
  ]);
  return { github: githubInfo, otaAvailable };
}

export function promptForUpdate(
  updateInfo: UpdateInfo,
  onStatusChange?: (status: UpdateStatus) => void
): void {
  Alert.alert(
    'Update Available',
    `Version ${updateInfo.version} is available.\n\n${updateInfo.releaseNotes || 'No release notes.'}\n\nThe update will be applied instantly — your plant data is safe.`,
    [
      {
        text: 'Skip This Version',
        style: 'cancel',
        onPress: () => setIgnoredVersion(updateInfo.version),
      },
      {
        text: 'Later',
        style: 'cancel',
      },
      {
        text: 'Update Now',
        onPress: () => fetchAndApplyUpdate(onStatusChange),
      },
    ]
  );
}
