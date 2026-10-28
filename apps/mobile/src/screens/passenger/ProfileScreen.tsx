import React from 'react';
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
import { Badge } from '../../components/ui/Badge';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import {
  User,
  Car,
  ShieldCheck,
  FileText,
  PhoneCall,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  Headphones,
} from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { toggleUserMode } = useApp();

  const handleSupport = () => {
    Haptics.light();
    Alert.alert('Qo’llab-quvvatlash', 'OTAXI 24/7 Call Center: +998 71 200 00 00');
  };

  const handleLogout = () => {
    Haptics.warning();
    Alert.alert('Chiqish', 'Akkauntdan chiqishni tasdiqlaysizmi?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Chiqish', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Profil va sozlamalar" subtitle="Shaxsiy ma’lumotlar va xavfsizlik" />

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
              <Badge label="Tasdiqlangan yo’lovchi" variant="success" size="sm" />
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
            <Text style={styles.switchTitle}>Haydovchi rejimiga o’tish</Text>
            <Text style={styles.switchSubtitle}>
              Shaharlararo yoki xalqaro reys e’lon qiling va barqaror daromad oling.
            </Text>
          </View>
          <ChevronRight size={18} color={COLORS.gray[400]} />
        </Card>

        {/* Settings Group */}
        <Card variant="surface" style={styles.settingsGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Haptics.selection()} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <Globe size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>Ilova tili</Text>
            <Text style={styles.menuValue}>O’zbekcha</Text>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleSupport} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <Headphones size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>24/7 Qo’llab-quvvatlash xizmati</Text>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => Haptics.selection()} activeOpacity={0.7}>
            <View style={styles.menuIconCircle}>
              <FileText size={18} color={COLORS.emerald[700]} />
            </View>
            <Text style={styles.menuTitle}>Foydalanish shartlari va maxfiylik</Text>
            <ChevronRight size={16} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title="Tizimdan chiqish"
          variant="outline"
          size="md"
          fullWidth
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color={COLORS.red[600]} />}
          style={styles.logoutBtn}
          textStyle={{ color: COLORS.red[600] }}
        />
      </ScrollView>
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
  menuValue: {
    fontSize: 12,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 12,
  },
  logoutBtn: {
    borderColor: COLORS.red[200],
  },
});
