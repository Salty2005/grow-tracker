import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STAGE_GUIDES, STAGE_COLORS, TRAINING_GUIDES, HARVEST_TIMING_GUIDE, PEST_GUIDE, STRAINS_INFO } from '../../constants';

type GuideSection = 'stages' | 'training' | 'harvest' | 'pests' | 'strains';

export default function GuideScreen() {
  const [activeSection, setActiveSection] = useState<GuideSection>('stages');
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const sections: { key: GuideSection; label: string; icon: string }[] = [
    { key: 'stages', label: 'Stages', icon: 'leaf' },
    { key: 'training', label: 'Training', icon: 'git-branch' },
    { key: 'harvest', label: 'Harvest', icon: 'cut' },
    { key: 'pests', label: 'Pests', icon: 'bug' },
    { key: 'strains', label: 'Types', icon: 'dna' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {sections.map((s) => (
          <TouchableOpacity key={s.key} onPress={() => setActiveSection(s.key)} style={[styles.tab, activeSection === s.key && styles.tabActive]}>
            <Ionicons name={s.icon as any} size={18} color={activeSection === s.key ? '#22c55e' : '#6b7280'} />
            <Text style={[styles.tabLabel, activeSection === s.key && styles.tabLabelActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.scrollContent}>
          {activeSection === 'stages' && (
            <>
              <Text style={styles.title}>Growth Stage Guide</Text>
              {STAGE_GUIDES.map((guide) => {
                const isExpanded = expandedStage === guide.stage;
                const color = STAGE_COLORS[guide.stage];
                return (
                  <View key={guide.stage} style={styles.stageItem}>
                    <TouchableOpacity onPress={() => setExpandedStage(isExpanded ? null : guide.stage)} style={styles.stageHeader} activeOpacity={0.7}>
                      <View style={[styles.stageIcon, { backgroundColor: color + '20' }]}><Ionicons name="leaf" size={18} color={color} /></View>
                      <View style={{ flex: 1 }}><Text style={styles.stageName}>{guide.name}</Text><Text style={styles.stageDuration}>{guide.duration}</Text></View>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#6b7280" />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.stageExpanded}>
                        <Text style={styles.description}>{guide.description}</Text>
                        <Text style={styles.sectionHeader}>KEY TASKS</Text>
                        {guide.keyTasks.map((task, i) => (
                          <View key={i} style={styles.taskRow}><Ionicons name="checkmark-circle" size={14} color={color} /><Text style={styles.taskText}>{task}</Text></View>
                        ))}
                        {guide.commonProblems.length > 0 && (
                          <>
                            <Text style={[styles.sectionHeader, { marginTop: 12 }]}>COMMON PROBLEMS</Text>
                            {guide.commonProblems.map((p, i) => <View key={i} style={styles.taskRow}><Ionicons name="alert-circle" size={14} color="#f59e0b" /><Text style={styles.taskText}>{p}</Text></View>)}
                          </>
                        )}
                        {guide.tips.length > 0 && (
                          <>
                            <Text style={[styles.sectionHeader, { marginTop: 12 }]}>PRO TIPS</Text>
                            {guide.tips.map((tip, i) => <View key={i} style={styles.taskRow}><Ionicons name="bulb" size={14} color="#22c55e" /><Text style={styles.taskText}>{tip}</Text></View>)}
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}

          {activeSection === 'training' && (
            <>
              <Text style={styles.title}>Training Techniques</Text>
              {Object.entries(TRAINING_GUIDES).map(([key, guide]) => (
                <View key={key} style={styles.card}>
                  <Text style={styles.cardTitle}>{guide.name}</Text>
                  <Text style={styles.description}>{guide.description}</Text>
                  <View style={styles.whenBox}><Text style={styles.whenLabel}>WHEN TO START</Text><Text style={styles.whenValue}>{guide.whenToStart}</Text></View>
                  <Text style={styles.sectionHeader}>HOW TO</Text>
                  {guide.howTo.map((step, i) => <View key={i} style={styles.taskRow}><Text style={styles.stepNumber}>{i + 1}.</Text><Text style={styles.taskText}>{step}</Text></View>)}
                  <Text style={[styles.sectionHeader, { marginTop: 12 }]}>BENEFITS</Text>
                  {guide.benefits.map((b, i) => <View key={i} style={styles.taskRow}><Ionicons name="checkmark" size={12} color="#22c55e" /><Text style={styles.taskText}>{b}</Text></View>)}
                </View>
              ))}
            </>
          )}

          {activeSection === 'harvest' && (
            <>
              <Text style={styles.title}>Harvest Timing Guide</Text>
              {Object.entries(HARVEST_TIMING_GUIDE).map(([key, guide]) => (
                <View key={key} style={styles.card}>
                  <Text style={styles.cardTitle}>{key.charAt(0).toUpperCase() + key.slice(1)} Harvest</Text>
                  <Text style={styles.description}>{guide.description}</Text>
                  <View style={styles.envGrid}>
                    <View style={styles.envItem}><Text style={styles.envLabel}>TRICHOMES</Text><Text style={styles.envValue}>{guide.trichomes}</Text></View>
                    <View style={styles.envItem}><Text style={styles.envLabel}>PISTILS</Text><Text style={styles.envValue}>{guide.pistils}</Text></View>
                  </View>
                  <View style={styles.whenBox}><Text style={styles.whenLabel}>EFFECT</Text><Text style={styles.effectText}>{guide.effect}</Text></View>
                </View>
              ))}
            </>
          )}

          {activeSection === 'pests' && (
            <>
              <Text style={styles.title}>Pest & Disease Guide</Text>
              {Object.entries(PEST_GUIDE).map(([key, pest]) => (
                <View key={key} style={styles.card}>
                  <Text style={styles.cardTitle}>{pest.name}</Text>
                  <View style={styles.infoBlock}><Text style={styles.infoLabel}>SIGNS</Text><Text style={styles.infoValue}>{pest.signs}</Text></View>
                  <View style={styles.infoBlock}><Text style={styles.infoLabel}>PREVENTION</Text><Text style={styles.infoValue}>{pest.prevention}</Text></View>
                  <View><Text style={styles.infoLabel}>TREATMENT</Text><Text style={styles.infoValue}>{pest.treatment}</Text></View>
                </View>
              ))}
            </>
          )}

          {activeSection === 'strains' && (
            <>
              <Text style={styles.title}>Cannabis Types</Text>
              {Object.entries(STRAINS_INFO).map(([key, info]) => (
                <View key={key} style={styles.card}>
                  <Text style={styles.cardTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.description}>{info.description}</Text>
                  <Text style={styles.sectionHeader}>ADVANTAGES</Text>
                  {info.advantages.map((a, i) => <View key={i} style={styles.taskRow}><Ionicons name="add-circle" size={12} color="#22c55e" /><Text style={styles.taskText}>{a}</Text></View>)}
                  <Text style={[styles.sectionHeader, { marginTop: 12 }]}>DISADVANTAGES</Text>
                  {info.disadvantages.map((d, i) => <View key={i} style={styles.taskRow}><Ionicons name="remove-circle" size={12} color="#ef4444" /><Text style={styles.taskText}>{d}</Text></View>)}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#22c55e' },
  tabLabel: { color: '#6b7280', fontSize: 10, marginTop: 4 },
  tabLabelActive: { color: '#4ade80' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16 },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1f2937', marginBottom: 16 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  description: { color: '#d1d5db', fontSize: 14, marginBottom: 12 },
  stageItem: { marginBottom: 12 },
  stageHeader: { backgroundColor: '#111827', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1f2937' },
  stageIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stageName: { color: '#fff', fontWeight: 'bold' },
  stageDuration: { color: '#6b7280', fontSize: 12 },
  stageExpanded: { backgroundColor: '#111827', padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderWidth: 1, borderTopWidth: 0, borderColor: '#1f2937' },
  sectionHeader: { color: '#fff', fontWeight: '600', fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  taskText: { color: '#d1d5db', fontSize: 12, flex: 1, marginLeft: 8 },
  stepNumber: { color: '#4ade80', fontWeight: 'bold', fontSize: 12, marginRight: 8, width: 16 },
  whenBox: { backgroundColor: '#1f2937', borderRadius: 8, padding: 12, marginBottom: 12 },
  whenLabel: { color: '#6b7280', fontSize: 10, marginBottom: 4, textTransform: 'uppercase' },
  whenValue: { color: '#fff', fontSize: 14 },
  effectText: { color: '#4ade80', fontSize: 14 },
  envGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  envItem: { marginRight: 12, marginBottom: 8 },
  envLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  envValue: { color: '#fff', fontSize: 13 },
  infoBlock: { marginBottom: 8 },
  infoLabel: { color: '#6b7280', fontSize: 10, marginBottom: 2, textTransform: 'uppercase' },
  infoValue: { color: '#d1d5db', fontSize: 13 },
});
