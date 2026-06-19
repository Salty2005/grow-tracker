import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMMON_DEFICIENCIES, PEST_GUIDE } from '../../constants';

type IssuesTab = 'deficiencies' | 'pests';

export default function DeficienciesScreen() {
  const [activeTab, setActiveTab] = useState<IssuesTab>('deficiencies');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const filteredDeficiencies = Object.entries(COMMON_DEFICIENCIES).filter(
    ([key, info]) => key.toLowerCase().includes(searchQuery.toLowerCase()) || info.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPests = Object.entries(PEST_GUIDE).filter(
    ([key, pest]) => pest.name.toLowerCase().includes(searchQuery.toLowerCase()) || pest.signs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('deficiencies')} style={[styles.tab, activeTab === 'deficiencies' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'deficiencies' && styles.tabTextActive]}>Nutrient Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('pests')} style={[styles.tab, activeTab === 'pests' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'pests' && styles.tabTextActive]}>Pests & Disease</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#6b7280" />
        <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search symptoms or issues..." placeholderTextColor="#6b7280" style={styles.searchInput} />
        {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color="#6b7280" /></TouchableOpacity>}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'deficiencies' && (
          <>
            <Text style={styles.title}>Nutrient Deficiencies</Text>
            {filteredDeficiencies.length === 0 ? (
              <View style={styles.emptyState}><Ionicons name="search-outline" size={48} color="#1f2937" /><Text style={styles.emptyText}>No matching deficiencies</Text></View>
            ) : (
              filteredDeficiencies.map(([key, info]) => (
                <TouchableOpacity key={key} onPress={() => setExpandedIssue(expandedIssue === key ? null : key)} style={styles.issueCard} activeOpacity={0.7}>
                  <View style={styles.issueHeader}>
                    <View style={[styles.issueIcon, { backgroundColor: '#f59e0b20' }]}><Ionicons name="alert-circle" size={18} color="#f59e0b" /></View>
                    <View style={{ flex: 1 }}><Text style={styles.issueName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text><Text style={styles.issueSubtext} numberOfLines={1}>{info.symptoms}</Text></View>
                    <Ionicons name={expandedIssue === key ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
                  </View>
                  {expandedIssue === key && (
                    <View style={styles.issueExpanded}>
                      <Text style={styles.infoLabel}>SYMPTOMS</Text><Text style={styles.infoValue}>{info.symptoms}</Text>
                      <Text style={[styles.infoLabel, { marginTop: 8 }]}>FIX</Text><Text style={styles.fixText}>{info.fix}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {activeTab === 'pests' && (
          <>
            <Text style={styles.title}>Pests & Diseases</Text>
            {filteredPests.length === 0 ? (
              <View style={styles.emptyState}><Ionicons name="search-outline" size={48} color="#1f2937" /><Text style={styles.emptyText}>No matching issues</Text></View>
            ) : (
              filteredPests.map(([key, pest]) => (
                <TouchableOpacity key={key} onPress={() => setExpandedIssue(expandedIssue === key ? null : key)} style={styles.issueCard} activeOpacity={0.7}>
                  <View style={styles.issueHeader}>
                    <View style={[styles.issueIcon, { backgroundColor: '#ef444420' }]}><Ionicons name="bug" size={18} color="#ef4444" /></View>
                    <View style={{ flex: 1 }}><Text style={styles.issueName}>{pest.name}</Text><Text style={styles.issueSubtext} numberOfLines={1}>{pest.signs}</Text></View>
                    <Ionicons name={expandedIssue === key ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
                  </View>
                  {expandedIssue === key && (
                    <View style={styles.issueExpanded}>
                      <Text style={styles.infoLabel}>SIGNS</Text><Text style={styles.infoValue}>{pest.signs}</Text>
                      <Text style={[styles.infoLabel, { marginTop: 8 }]}>PREVENTION</Text><Text style={styles.infoValue}>{pest.prevention}</Text>
                      <Text style={[styles.infoLabel, { marginTop: 8 }]}>TREATMENT</Text><Text style={styles.fixText}>{pest.treatment}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#22c55e' },
  tabText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#4ade80' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 12, paddingHorizontal: 12, margin: 16, marginBottom: 0, borderWidth: 1, borderColor: '#1f2937' },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 12, paddingHorizontal: 8 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16 },
  issueCard: { backgroundColor: '#111827', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 12 },
  issueHeader: { flexDirection: 'row', alignItems: 'center' },
  issueIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  issueName: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  issueSubtext: { color: '#9ca3af', fontSize: 12 },
  issueExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1f2937' },
  infoLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { color: '#d1d5db', fontSize: 13 },
  fixText: { color: '#4ade80', fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#6b7280', marginTop: 12 },
});
