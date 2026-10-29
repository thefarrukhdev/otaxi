import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS } from '../../lib/theme';
import { Header } from '../../components/shared/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { BottomSheetModal } from '../../components/ui/BottomSheetModal';
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
          <Avatar
            name="Farrukh Bek"
            size="lg"
            isVerified
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.userName}>Farrukh Bek</Text>
              <ShieldCheck size={16} color="#FF8800" />
            </View>
            <Text style={styles.userPhone}>+998 90 999 88 11</Text>
            <Text style={styles.verifiedRoleText}>Tasdiqlangan haydovchi</Text>
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
            <Car size={24} color="#FF8800" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>{t.common.switchToDriver}</Text>
            <Text style={styles.switchSubtitle}>
              Shaharlararo yoki xalqaro reys e’lon qiling va barqaror daromad oling.
            </Text>
          </View>
          <ChevronRight size={18} color="#FF8800" />
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
              <Globe size={18} color="#FF8800" />
            </View>
            <Text style={styles.menuTitle}>{t.profile.language}</Text>
            <View style={styles.langBadgeContainer}>
              <Text style={styles.flagIcon}>{currentLangObj.flag}</Text>
              <Text style={styles.menuValue}>{currentLangObj.label}</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleSupport} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <Headphones size={18} color="#FF8800" />
            </View>
            <Text style={styles.menuTitle}>{t.profile.support}</Text>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => Haptics.selection()} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <FileText size={18} color="#FF8800" />
            </View>
            <Text style={styles.menuTitle}>{t.profile.privacy}</Text>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title={t.profile.logout}
          variant="outline"
          size="md"
          fullWidth
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color={COLORS.red[500]} />}
          style={styles.logoutBtn}
          textStyle={{ color: COLORS.red[500] }}
        />
      </ScrollView>

      {/* Language Selector BottomSheetModal */}
      <BottomSheetModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        title={t.profile.language}
        subtitle="Interfeys tilini tanlang"
      >
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
                    <Check size={14} color="#0C0D11" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    backgroundColor: '#FF8800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0C0D11',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userPhone: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  verifiedRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 3,
  },
  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#15171E',
    borderColor: '#272B35',
  },
  switchIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 136, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF8800',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
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
    backgroundColor: '#1D2029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  langBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1D2029',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  flagIcon: {
    fontSize: 14,
  },
  menuValue: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#272B35',
    marginHorizontal: 12,
  },
  logoutBtn: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#15171E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#272B35',
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
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D2029',
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
    borderColor: '#272B35',
    backgroundColor: '#0C0D11',
    gap: 12,
  },
  langItemSelected: {
    borderColor: '#FF8800',
    backgroundColor: '#1D2029',
  },
  langItemFlag: {
    fontSize: 26,
  },
  langItemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  langItemLabelSelected: {
    color: '#FF8800',
  },
  langItemSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF8800',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
