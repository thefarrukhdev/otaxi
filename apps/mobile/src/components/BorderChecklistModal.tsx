import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../lib/theme';
import { useApp } from '../context/AppContext';
import { BorderChecklistGroup } from '../types';
import { ShieldCheck, CheckSquare, Square, X, AlertTriangle, FileText, Globe } from 'lucide-react-native';

interface BorderChecklistModalProps {
  visible: boolean;
  onClose: () => void;
  checklist: BorderChecklistGroup;
  onConfirm?: () => void;
}

export const BorderChecklistModal: React.FC<BorderChecklistModalProps> = ({
  visible,
  onClose,
  checklist,
  onConfirm,
}) => {
  const { checkedItems, toggleChecklistItem } = useApp();
  const [acknowledged, setAcknowledged] = useState(false);

  const totalRequired = checklist.items.filter((i) => i.isRequired).length;
  const checkedRequired = checklist.items.filter(
    (i) => i.isRequired && checkedItems[i.id]
  ).length;
  const progressPercent = Math.round((checkedRequired / totalRequired) * 100);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Modal Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={22} color={COLORS.emerald[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {checklist.title}
              </Text>
              <Text style={styles.headerSubtitle}>
                PRD 8.2 PAS-11 & Appendix 22 rasmiy talablari
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={COLORS.gray[500]} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Chegara tayyorgarligi holati:</Text>
            <Text style={styles.progressValue}>
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
        </View>

        {/* Scrollable Checklist Items */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Important Notice Banner */}
          <View style={styles.noticeBanner}>
            <AlertTriangle size={18} color={COLORS.amber[700]} />
            <Text style={styles.noticeText}>
              Xalqaro reyslarda chegara nazoratidan o’tish uchun barcha talablar bilan to’liq tanishib chiqing.
            </Text>
          </View>

          {checklist.items.map((item) => {
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
                      <Text style={styles.requiredText}>Majburiy</Text>
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

          {/* Acknowledgement Toggle */}
          <View style={styles.ackSection}>
            <View style={styles.ackRow}>
              <Switch
                value={acknowledged}
                onValueChange={setAcknowledged}
                trackColor={{ false: COLORS.gray[300], true: COLORS.emerald[500] }}
                thumbColor={COLORS.white}
              />
              <Text style={styles.ackText}>
                Chegara talablari va qoidalari bilan to’liq tanishdim hamda shaxsiy hujjatlarimning yaroqliligi uchun javobgarlikni zimmamga olaman.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!acknowledged || progressPercent < 60) && styles.confirmButtonDisabled,
            ]}
            disabled={!acknowledged || progressPercent < 60}
            onPress={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            <ShieldCheck size={18} color={COLORS.white} />
            <Text style={styles.confirmButtonText}>
              Tayyorgarlikni tasdiqlash ({progressPercent}%)
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  progressContainer: {
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.emerald[100],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[900],
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.emerald[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.amber[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.amber[200],
    gap: 10,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 12,
    color: COLORS.amber[900],
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    padding: 14,
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
    fontSize: 11,
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
  requiredText: {
    fontSize: 10,
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
  ackSection: {
    backgroundColor: COLORS.gray[50],
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginTop: 8,
    marginBottom: 20,
  },
  ackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ackText: {
    fontSize: 12,
    color: COLORS.gray[800],
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  confirmButton: {
    backgroundColor: COLORS.emerald[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.md,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
