import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { useApp } from '../../context/AppContext';
import { BorderChecklistGroup } from '../../types';
import { ProgressRing } from '../ui/ProgressRing';
import { Button } from '../ui/Button';
import { Haptics } from '../ui/Haptics';
import {
  ShieldCheck,
  CheckSquare,
  Square,
  X,
  AlertTriangle,
  FileText,
  Globe,
  Info,
} from 'lucide-react-native';

export interface BorderChecklistModalProps {
  visible: boolean;
  onClose: () => void;
  checklist: BorderChecklistGroup;
  onConfirm?: () => void;
}

export const BorderChecklistModal: React.FC<BorderChecklistModalProps> = React.memo(
  ({ visible, onClose, checklist, onConfirm }) => {
    const { checkedItems, toggleChecklistItem } = useApp();
    const [acknowledged, setAcknowledged] = useState(false);

    const totalRequired = checklist.items.filter((i) => i.isRequired).length;
    const checkedRequired = checklist.items.filter(
      (i) => i.isRequired && checkedItems[i.id]
    ).length;
    const progressPercent = totalRequired > 0 ? Math.round((checkedRequired / totalRequired) * 100) : 100;
    const isAllChecked = checkedRequired === totalRequired;

    const handleItemToggle = (itemId: string) => {
      Haptics.selection();
      toggleChecklistItem(itemId);
    };

    const handleConfirm = () => {
      Haptics.success();
      onConfirm?.();
      onClose();
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={22} color="#FF8800" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {checklist.title}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {checklist.subtitle || 'Rasmiy chegara nazorati talablari'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Progress Overview Hero Card */}
          <View style={styles.progressCard}>
            <ProgressRing
              progress={progressPercent}
              size={68}
              strokeWidth={6}
              centerText={`${progressPercent}%`}
              centerSubtext={`${checkedRequired}/${totalRequired}`}
            />
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Chegara tayyorgarligi holati</Text>
              <Text style={styles.progressSubtitle}>
                {isAllChecked
                  ? 'Barcha majburiy talablar tekshirildi! Safarga tayyorsiz.'
                  : `${totalRequired - checkedRequired} ta bandni tasdiqlashingiz kerak.`}
              </Text>
            </View>
          </View>

          {/* Scrollable Checklist Items */}
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Notice Alert Banner */}
            <View style={styles.noticeBanner}>
              <AlertTriangle size={18} color={COLORS.amber[700]} />
              <Text style={styles.noticeText}>
                Xalqaro reyslarda chegara punktida (bojxona va pasport nazorati) muammoga duch kelmaslik uchun barcha bandlarni ko’zdan kechiring.
              </Text>
            </View>

            {/* Checklist Items */}
            <View style={styles.itemsList}>
              {checklist.items.map((item, index) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                    onPress={() => handleItemToggle(item.id)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.checkboxWrapper}>
                      {isChecked ? (
                        <CheckSquare size={22} color={COLORS.emerald[600]} />
                      ) : (
                        <Square size={22} color={COLORS.gray[400]} />
                      )}
                    </View>

                    <View style={styles.itemContent}>
                      <View style={styles.itemTitleRow}>
                        <Text style={[styles.itemIndexText]}>#{index + 1}</Text>
                        <Text
                          style={[
                            styles.itemTitle,
                            isChecked && styles.itemTitleChecked,
                          ]}
                        >
                          {item.title}
                        </Text>
                        {item.isRequired && (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.requiredBadgeText}>Majburiy</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Acknowledgment Agreement Box */}
            <TouchableOpacity
              style={styles.ackBox}
              onPress={() => {
                Haptics.selection();
                setAcknowledged(!acknowledged);
              }}
              activeOpacity={0.8}
            >
              {acknowledged ? (
                <CheckSquare size={20} color={COLORS.emerald[600]} />
              ) : (
                <Square size={20} color={COLORS.gray[400]} />
              )}
              <Text style={styles.ackText}>
                Men xalqaro chegara tartib-qoidalari, xorijiy pasport va bojxona me’yorlari bilan to’liq tanishdim.
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomBar}>
            <Button
              title={
                isAllChecked || acknowledged
                  ? 'Chegara talablari bilan tanishdim'
                  : `Qolgan talablarni tekshiring (${checkedRequired}/${totalRequired})`
              }
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isAllChecked && !acknowledged}
              onPress={handleConfirm}
              leftIcon={<ShieldCheck size={18} color={COLORS.white} />}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
);

BorderChecklistModal.displayName = 'BorderChecklistModal';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#272B35',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#272B35',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#1D2029',
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    gap: 14,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#251B10',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#593412',
    gap: 10,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#FFA033',
    lineHeight: 17,
  },
  itemsList: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemCardChecked: {
    backgroundColor: '#1D2029',
    borderColor: '#FF8800',
  },
  checkboxWrapper: {
    marginTop: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  itemIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  itemTitleChecked: {
    color: '#FF8800',
  },
  requiredBadge: {
    backgroundColor: '#281417',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#661F25',
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F87171',
  },
  itemDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  ackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#15171E',
    borderWidth: 1,
    borderColor: '#272B35',
    gap: 10,
  },
  ackText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    lineHeight: 16,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
    backgroundColor: '#15171E',
  },
});
