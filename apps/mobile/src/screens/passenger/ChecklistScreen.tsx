import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { useApp } from '../../context/AppContext';
import { BORDER_CHECKLISTS } from '../../lib/data';
import {
  ShieldCheck,
  CheckSquare,
  Square,
  Globe,
  AlertTriangle,
  Info,
  Calendar,
} from 'lucide-react-native';

export const ChecklistScreen: React.FC = () => {
  const { checkedItems, toggleChecklistItem } = useApp();
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('UZ-KZ');

  const currentChecklist = BORDER_CHECKLISTS[selectedRouteKey] || BORDER_CHECKLISTS['UZ-KZ'];

  const totalRequired = currentChecklist.items.filter((i) => i.isRequired).length;
  const checkedRequired = currentChecklist.items.filter(
    (i) => i.isRequired && checkedItems[i.id]
  ).length;
  const progressPercent = Math.round((checkedRequired / totalRequired) * 100);

  return (
    <View style={styles.container}>
      <Header
        title="Xalqaro chegara qo’llanmasi"
        subtitle="Markaziy Osiyo davlat chegaralarini kesib o’tish rasmiy qoidalari"
      />

      {/* Route Switcher Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedRouteKey === 'UZ-KZ' && styles.tabBtnActive]}
            onPress={() => setSelectedRouteKey('UZ-KZ')}
          >
            <Text style={[styles.tabText, selectedRouteKey === 'UZ-KZ' && styles.tabTextActive]}>
              O’zbekiston — Qozog’iston
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedRouteKey === 'UZ-KG' && styles.tabBtnActive]}
            onPress={() => setSelectedRouteKey('UZ-KG')}
          >
            <Text style={[styles.tabText, selectedRouteKey === 'UZ-KG' && styles.tabTextActive]}>
              O’zbekiston — Qirg’iziston
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedRouteKey === 'UZ-TJ' && styles.tabBtnActive]}
            onPress={() => setSelectedRouteKey('UZ-TJ')}
          >
            <Text style={[styles.tabText, selectedRouteKey === 'UZ-TJ' && styles.tabTextActive]}>
              O’zbekiston — Tojikiston
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Route Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.iconCircle}>
              <Globe size={22} color={COLORS.blue[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>{currentChecklist.title}</Text>
              <Text style={styles.infoSubtitle}>{currentChecklist.subtitle}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Versiya: {currentChecklist.version} • Tekshirilgan: {currentChecklist.lastVerified}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Chegara tayyorgarligi holati:</Text>
            <Text style={styles.progressScore}>
              {checkedRequired} / {totalRequired} ({progressPercent}%)
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent === 100 ? COLORS.emerald[500] : COLORS.amber[500],
                },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            Safarga chiqishdan oldin har bir talabni tekshirib, katakchalarni belgilab boring.
          </Text>
        </View>

        {/* Checklist Items */}
        <Text style={styles.sectionHeading}>Majburiy hujjatlar va talablar</Text>

        {currentChecklist.items.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isChecked && styles.itemCardChecked]}
              onPress={() => toggleChecklistItem(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.itemHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.categoryTitle}</Text>
                </View>
                {item.isRequired && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredBadgeText}>Majburiy</Text>
                  </View>
                )}
                <View style={styles.checkboxContainer}>
                  {isChecked ? (
                    <CheckSquare size={22} color={COLORS.emerald[600]} />
                  ) : (
                    <Square size={22} color={COLORS.gray[400]} />
                  )}
                </View>
              </View>

              <Text style={[styles.itemTitle, isChecked && styles.itemTitleChecked]}>
                {item.title}
              </Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Official Source Note */}
        <View style={styles.sourceNote}>
          <Info size={16} color={COLORS.gray[500]} />
          <Text style={styles.sourceText}>
            Manba: {currentChecklist.officialSource}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  tabsWrapper: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  tabsRow: {
    paddingHorizontal: 16,
  },
  tabBtn: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  tabBtnActive: {
    backgroundColor: COLORS.blue[600],
    borderColor: COLORS.blue[700],
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  tabTextActive: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.blue[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  infoSubtitle: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  metaRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  metaText: {
    fontSize: 10,
    color: COLORS.gray[400],
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.emerald[200],
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[800],
  },
  progressScore: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.emerald[700],
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 11,
    color: COLORS.gray[500],
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  itemCardChecked: {
    borderColor: COLORS.emerald[500],
    backgroundColor: '#fafffd',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.blue[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.blue[700],
  },
  requiredBadge: {
    backgroundColor: COLORS.red[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  requiredBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.red[600],
  },
  checkboxContainer: {
    marginLeft: 'auto',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  itemTitleChecked: {
    color: COLORS.emerald[900],
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.gray[600],
    lineHeight: 18,
  },
  sourceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 11,
    color: COLORS.gray[600],
    flex: 1,
  },
});
