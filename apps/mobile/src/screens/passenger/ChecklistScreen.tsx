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
import { Badge } from '../../components/Badge';
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
  Sparkles,
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
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedRouteKey === 'UZ-KZ' && styles.tabBtnActive,
            ]}
            onPress={() => {
              Haptics.light();
              setSelectedRouteKey('UZ-KZ');
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedRouteKey === 'UZ-KZ' && styles.tabTextActive,
              ]}
            >
              🇺🇿 O'zbekiston — Qozog'iston 🇰🇿
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedRouteKey === 'UZ-KG' && styles.tabBtnActive,
            ]}
            onPress={() => {
              Haptics.light();
              setSelectedRouteKey('UZ-KG');
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedRouteKey === 'UZ-KG' && styles.tabTextActive,
              ]}
            >
              🇺🇿 O'zbekiston — Qirg'iziston 🇰🇬
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedRouteKey === 'UZ-TJ' && styles.tabBtnActive,
            ]}
            onPress={() => {
              Haptics.light();
              setSelectedRouteKey('UZ-TJ');
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedRouteKey === 'UZ-TJ' && styles.tabTextActive,
              ]}
            >
              🇺🇿 O'zbekiston — Tojikiston 🇹🇯
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Ring Hero Card */}
        <View
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
              {isAllRequiredChecked ? (
                <View style={styles.readyRow}>
                  <CheckCircle2 size={13} color="#10B981" />
                  <Text style={styles.readyText}>Tayyorsiz</Text>
                </View>
              ) : (
                <View style={styles.pendingRow}>
                  <AlertTriangle size={13} color="#FF8800" />
                  <Text style={styles.pendingText}>Tayyorlanmoqda</Text>
                </View>
              )}
            </View>

            <Text style={styles.progressStatusDesc}>
              {isAllRequiredChecked
                ? 'Tabriklaymiz! Barcha majburiy talablar tekshirildi. Chegaradan muammosiz o\'tishingiz mumkin.'
                : `${totalRequired - checkedRequired} ta majburiy talab qoldi. Safar kuni bekatga chiqishdan oldin tekshirib chiqing.`}
            </Text>

            <View style={styles.progressActionRow}>
              <TouchableOpacity
                style={styles.quickActionBtn}
                onPress={handleCheckAll}
              >
                <Sparkles size={12} color={COLORS.emerald[700]} />
                <Text style={styles.quickActionBtnText}>Barchasini belgilash</Text>
              </TouchableOpacity>

              {totalCheckedCount > 0 && (
                <TouchableOpacity
                  style={styles.resetActionBtn}
                  onPress={handleReset}
                >
                  <RotateCcw size={12} color={COLORS.gray[500]} />
                  <Text style={styles.resetActionBtnText}>Qayta o'rnatish</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Route Info & Official Source Card */}
        <View style={styles.infoCard}>
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
        </View>

        {/* Category Filters */}
        <View style={styles.categoryFiltersRow}>
          <TouchableOpacity
            style={[
              styles.catFilterChip,
              categoryFilter === 'ALL' && styles.catFilterChipActive,
            ]}
            onPress={() => {
              Haptics.light();
              setCategoryFilter('ALL');
            }}
          >
            <Text
              style={[
                styles.catFilterChipText,
                categoryFilter === 'ALL' && styles.catFilterChipTextActive,
              ]}
            >
              Barchasi ({currentChecklist.items.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.catFilterChip,
              categoryFilter === 'REQUIRED' && styles.catFilterChipActive,
            ]}
            onPress={() => {
              Haptics.light();
              setCategoryFilter('REQUIRED');
            }}
          >
            <Text
              style={[
                styles.catFilterChipText,
                categoryFilter === 'REQUIRED' && styles.catFilterChipTextActive,
              ]}
            >
              Majburiy ({totalRequired})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.catFilterChip,
              categoryFilter === 'PASSPORT_VISA' && styles.catFilterChipActive,
            ]}
            onPress={() => {
              Haptics.light();
              setCategoryFilter('PASSPORT_VISA');
            }}
          >
            <Text
              style={[
                styles.catFilterChipText,
                categoryFilter === 'PASSPORT_VISA' &&
                  styles.catFilterChipTextActive,
              ]}
            >
              Pasport & Viza
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.catFilterChip,
              categoryFilter === 'CUSTOMS' && styles.catFilterChipActive,
            ]}
            onPress={() => {
              Haptics.light();
              setCategoryFilter('CUSTOMS');
            }}
          >
            <Text
              style={[
                styles.catFilterChipText,
                categoryFilter === 'CUSTOMS' && styles.catFilterChipTextActive,
              ]}
            >
              Bojxona
            </Text>
          </TouchableOpacity>
        </View>

        {/* Checklist Items List */}
        <View style={styles.itemsSection}>
          {filteredItems.map((item, index) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                onPress={() => handleToggle(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemBadgeGroup}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {item.categoryTitle}
                      </Text>
                    </View>
                    {item.isRequired && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredBadgeText}>Majburiy</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.checkboxWrapper}>
                    {isChecked ? (
                      <CheckSquare size={22} color={COLORS.emerald[600]} />
                    ) : (
                      <Square size={22} color={COLORS.gray[400]} />
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
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legal Disclaimer Footer */}
        <View style={styles.disclaimerBox}>
          <Info size={16} color={COLORS.gray[500]} />
          <Text style={styles.disclaimerText}>
            Eslatma: Chegara va bojxona nazorati talablari davlat organlari tomonidan yangilanishi mumkin. Safarga chiqishdan oldin rasmiy organlar bilan aniqlashtirish tavsiya etiladi.
          </Text>
        </View>
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
