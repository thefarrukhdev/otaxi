import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Button, Card, Badge, SegmentedControl, EmptyState } from '../../components/ui';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Haptics } from '../../components/ui/Haptics';
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
  CheckCircle2,
  RotateCcw,
  FileText,
} from 'lucide-react-native';

export const ChecklistScreen: React.FC = () => {
  const { checkedItems, toggleChecklistItem } = useApp();
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('UZ-KZ');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'REQUIRED' | 'PASSPORT_VISA' | 'CUSTOMS'>('ALL');

  const currentChecklist =
    BORDER_CHECKLISTS[selectedRouteKey] || BORDER_CHECKLISTS['UZ-KZ'];

  const totalRequired = currentChecklist.items.filter((i) => i.isRequired).length;
  const checkedRequired = currentChecklist.items.filter(
    (i) => i.isRequired && checkedItems[i.id]
  ).length;

  const totalItemsCount = currentChecklist.items.length;
  const totalCheckedCount = currentChecklist.items.filter(
    (i) => checkedItems[i.id]
  ).length;

  const progressPercent =
    totalRequired > 0 ? Math.round((checkedRequired / totalRequired) * 100) : 100;
  const isAllRequiredChecked = checkedRequired === totalRequired;

  const filteredItems = useMemo(() => {
    return currentChecklist.items.filter((item) => {
      if (categoryFilter === 'REQUIRED') return item.isRequired;
      if (categoryFilter === 'PASSPORT_VISA') {
        return item.category === 'PASSPORT' || item.category === 'VISA';
      }
      if (categoryFilter === 'CUSTOMS') {
        return item.category === 'CUSTOMS' || item.category === 'CURRENCY';
      }
      return true;
    });
  }, [currentChecklist.items, categoryFilter]);

  const handleToggle = (itemId: string) => {
    Haptics.selection();
    toggleChecklistItem(itemId);
  };

  const handleCheckAll = () => {
    Haptics.success();
    currentChecklist.items.forEach((item) => {
      if (!checkedItems[item.id]) {
        toggleChecklistItem(item.id);
      }
    });
  };

  const handleReset = () => {
    Haptics.warning();
    currentChecklist.items.forEach((item) => {
      if (checkedItems[item.id]) {
        toggleChecklistItem(item.id);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Xalqaro chegara tayyorgarligi"
        subtitle="Markaziy Osiyo davlat chegaralarini kesib o'tish rasmiy qoidalari"
      />

      {/* Route Switcher Tabs */}
      <SegmentedControl
        items={[
          { id: 'UZ-KZ', label: "O'zbekiston — Qozog'iston" },
          { id: 'UZ-KG', label: "O'zbekiston — Qirg'iziston" },
          { id: 'UZ-TJ', label: "O'zbekiston — Tojikiston" },
        ]}
        selectedId={selectedRouteKey}
        onSelect={(id) => setSelectedRouteKey(id)}
        style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 8 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Ring Hero Card */}
        <Card
          variant="surface"
          style={[
            styles.progressCard,
            isAllRequiredChecked && styles.progressCardSuccess,
          ]}
        >
          <View style={styles.progressRingWrapper}>
            <ProgressRing
              progress={progressPercent}
              size={88}
              strokeWidth={8}
              centerText={`${progressPercent}%`}
              centerSubtext={`${checkedRequired}/${totalRequired}`}
            />
          </View>

          <View style={styles.progressTextCol}>
            <View style={styles.progressBadgeRow}>
              <Text style={styles.progressHeading}>Chegara tayyorgarligi</Text>
              <Badge
                variant={isAllRequiredChecked ? 'success' : 'warning'}
                size="sm"
                label={isAllRequiredChecked ? 'Tayyorsiz' : 'Tayyorlanmoqda'}
              />
            </View>

            <Text style={styles.progressStatusDesc}>
              {isAllRequiredChecked
                ? 'Tabriklaymiz! Barcha majburiy talablar tekshirildi. Chegaradan muammosiz o\'tishingiz mumkin.'
                : `${totalRequired - checkedRequired} ta majburiy talab qoldi. Safar kuni bekatga chiqishdan oldin tekshirib chiqing.`}
            </Text>

            <View style={styles.progressActionRow}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCircle2 size={12} color="#10B981" />}
                title="Barchasini belgilash"
                onPress={handleCheckAll}
              />

              {totalCheckedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RotateCcw size={12} color="#94A3B8" />}
                  title="Qayta o'rnatish"
                  onPress={handleReset}
                />
              )}
            </View>
          </View>
        </Card>

        {/* Route Info & Official Source Card */}
        <Card variant="surface" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.iconCircle}>
              <Globe size={20} color={COLORS.blue[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>{currentChecklist.title}</Text>
              <Text style={styles.infoSubtitle}>{currentChecklist.subtitle}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Rasmiy manba: {currentChecklist.officialSource} • Versiya: {currentChecklist.version}
            </Text>
          </View>
        </Card>

        {/* Category Filters */}
        <SegmentedControl
          size="sm"
          items={[
            { id: 'ALL', label: `Barchasi (${currentChecklist.items.length})` },
            { id: 'REQUIRED', label: `Majburiy (${totalRequired})` },
            { id: 'PASSPORT_VISA', label: 'Pasport & Viza' },
            { id: 'CUSTOMS', label: 'Bojxona' },
          ]}
          selectedId={categoryFilter}
          onSelect={(id) => setCategoryFilter(id as any)}
          style={{ marginBottom: 14 }}
        />

        {/* Checklist Items List */}
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={32} color="#FF8800" />}
            title="Talablar topilmadi"
            description="Ushbu toifada ko'rsatiladigan chegara talablari mavjud emas."
          />
        ) : (
          <View style={styles.itemsSection}>
            {filteredItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <Card
                  key={item.id}
                  variant="surface"
                  pressable
                  onPress={() => handleToggle(item.id)}
                  style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemBadgeGroup}>
                      <Badge
                        variant="neutral"
                        size="sm"
                        label={item.categoryTitle}
                      />
                      {item.isRequired && (
                        <Badge
                          variant="warning"
                          size="sm"
                          label="Majburiy"
                        />
                      )}
                    </View>

                    <View style={styles.checkboxWrapper}>
                      {isChecked ? (
                        <CheckSquare size={22} color="#10B981" />
                      ) : (
                        <Square size={22} color="#64748B" />
                      )}
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.itemTitle,
                      isChecked && styles.itemTitleChecked,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
  tabsWrapper: {
    backgroundColor: '#15171E',
    borderBottomWidth: 1,
    borderBottomColor: '#272B35',
    paddingVertical: 8,
  },
  tabsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1D2029',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  tabBtnActive: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15171E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  progressCardSuccess: {
    borderColor: 'rgba(255, 136, 0, 0.4)',
    backgroundColor: '#1D2029',
  },
  progressRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextCol: {
    flex: 1,
  },
  progressBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  progressStatusDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 10,
  },
  progressActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 136, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  quickActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  resetActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1D2029',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  resetActionBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  infoCard: {
    backgroundColor: '#15171E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 14,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  infoSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  metaRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
  },
  metaText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryFiltersRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  catFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  catFilterChipActive: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  catFilterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  catFilterChipTextActive: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  itemsSection: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: '#15171E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#272B35',
    padding: 14,
  },
  itemCardChecked: {
    borderColor: 'rgba(255, 136, 0, 0.4)',
    backgroundColor: '#1D2029',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemBadgeGroup: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#1D2029',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  requiredBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F87171',
  },
  checkboxWrapper: {
    padding: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemTitleChecked: {
    color: '#FF8800',
    textDecorationLine: 'none',
  },
  itemDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  disclaimerBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: '#15171E',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    flex: 1,
  },
});
