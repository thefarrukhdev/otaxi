import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '../../lib/theme';
import { Header } from '../../components/shared/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../locales';
import {
  User,
  Car,
  ShieldCheck,
  FileText,
  Globe,
  LogOut,
  ChevronRight,
  Headphones,
  Check,
  X,
} from 'lucide-react-native';

const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; flag: string; subLabel: string }[] = [
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿', subLabel: 'Lotin alifbosida' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', subLabel: 'Официальный перевод' },
  { code: 'en', label: 'English', flag: '🇬🇧', subLabel: 'International travelers' },
];

export const ProfileScreen: React.FC = () => {
  const { toggleUserMode, language, setLanguage, t } = useApp();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  const handleSupport = () => {
    Haptics.light();
    Alert.alert('OTAXI 24/7 Support', 'Call Center: +998 71 200 00 00\nTelegram: @otaxi_support_bot');
  };

  const handleLogout = () => {
    Haptics.warning();
    Alert.alert(t.profile.logout, 'Akkauntdan chiqishni tasdiqlaysizmi?', [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: () => {} },
    ]);
  };

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    Haptics.selection();
    setLanguage(lang);
    setLangModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title={t.profile.title} subtitle={t.profile.subtitle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <Card variant="surface" style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FB</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.userName}>Farrukh Bek</Text>
              <ShieldCheck size={16} color={COLORS.emerald[600]} />
            </View>
            <Text style={styles.userPhone}>+998 90 999 88 11</Text>
            <View style={{ marginTop: 4 }}>
              <Badge label={t.common.verifiedDriver.replace(' ★', '')} variant="success" size="sm" />
            </View>
          </View>
        </Card>

        {/* inDrive Mode Switch Banner */}
        <Card
          variant="surface"
          pressable
          onPress={() => {
            Haptics.medium();
            toggleUserMode();
          }}
          style={styles.switchModeCard}
        >
          <View style={styles.switchIconBox}>
            <Car size={24} color={COLORS.amber[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>{t.common.switchToDriver}</Text>
            <Text style={styles.switchSubtitle}>
              Shaharlararo yoki xalqaro reys e’lon qiling va barqaror daromad oling.
            </Text>
          </View>
          <ChevronRight size={18} color={COLORS.gray[400]} />
        </Card>

        {/* Settings Group */}
        <Card variant="surface" style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Haptics.light();
              setLangModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Globe size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>{t.profile.language}</Text>
            <View style={styles.langBadgeContainer}>
              <Text style={styles.flagIcon}>{currentLangObj.flag}</Text>
              <Text style={styles.menuValue}>{currentLangObj.label}</Text>
            </View>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleSupport} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <Headphones size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>{t.profile.support}</Text>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => Haptics.selection()} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <FileText size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>{t.profile.privacy}</Text>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title={t.profile.logout}
          variant="outline"
          size="md"
          fullWidth
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color={COLORS.red[600]} />}
          style={styles.logoutBtn}
          textStyle={{ color: COLORS.red[600] }}
        />
      </ScrollView>

      {/* Language Selector Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{t.profile.language}</Text>
                <Text style={styles.modalSubtitle}>Interfeys tilini tanlang</Text>
              </View>
              <TouchableOpacity
                onPress={() => setLangModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={COLORS.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.langList}>
              {LANGUAGE_OPTIONS.map((item) => {
                const isSelected = item.code === language;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[styles.langItem, isSelected && styles.langItemSelected]}
                    onPress={() => handleSelectLanguage(item.code)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.langItemFlag}>{item.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.langItemLabel, isSelected && styles.langItemLabelSelected]}>
                        {item.label}
                      </Text>
                      <Text style={styles.langItemSub}>{item.subLabel}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Check size={14} color={COLORS.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    marginBottom: 12,
    backgroundColor: COLORS.navy[900],
    borderColor: COLORS.navy[800],
  },
  switchIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  switchSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
    lineHeight: 15,
  },
  settingsGroup: {
    padding: 6,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[800],
    flex: 1,
  },
  langBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flagIcon: {
    fontSize: 14,
  },
  menuValue: {
    fontSize: 12,
    color: COLORS.gray[700],
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 12,
  },
  logoutBtn: {
    borderColor: COLORS.red[200],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  langList: {
    gap: 10,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.gray[50],
    gap: 12,
  },
  langItemSelected: {
    borderColor: COLORS.emerald[600],
    backgroundColor: COLORS.emerald[50],
  },
  langItemFlag: {
    fontSize: 26,
  },
  langItemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  langItemLabelSelected: {
    color: COLORS.emerald[800],
  },
  langItemSub: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
