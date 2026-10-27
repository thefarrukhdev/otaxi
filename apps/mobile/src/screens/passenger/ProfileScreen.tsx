import React from 'react';
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

  return (
    <View style={styles.container}>
      <Header title="Profil va sozlamalar" subtitle="Shaxsiy ma’lumotlar va xavfsizlik" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
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
              <Badge label="Tasdiqlangan yo’lovchi" variant="emerald" />
            </View>
          </View>
        </View>

        {/* Switch to Driver Mode Banner (inDrive style) */}
        <TouchableOpacity style={styles.switchModeCard} onPress={toggleUserMode} activeOpacity={0.85}>
          <View style={styles.switchIconBox}>
            <Car size={24} color={COLORS.amber[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Haydovchi rejimiga o’tish</Text>
            <Text style={styles.switchSubtitle}>
              Shaharlararo yoki xalqaro reys e’lon qiling va daromad oling
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.amber[400]} />
        </TouchableOpacity>

        {/* Saved Travel Documents */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Safar hujjatlari</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <FileText size={18} color={COLORS.gray[500]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemTitle}>Xorijiy pasport (Biometrik)</Text>
                <Text style={styles.menuItemSubtitle}>FA1234567 • Yaroqlilik: 2032-yilgacha</Text>
              </View>
              <Badge label="Faol" variant="emerald" />
            </View>
          </View>
        </View>

        {/* Support & Contacts */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Qo’llab-quvvatlash</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Aloqa', 'OTAXI 24/7 Call-markazi: +998 71 200 00 00')}
            >
              <Headphones size={18} color={COLORS.emerald[600]} />
              <Text style={[styles.menuItemTitle, { flex: 1 }]}>24/7 Qo’llab-quvvatlash xizmati</Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('SOS', 'Favqulodda tezkor yordam liniyasi: 112 / 102')}
            >
              <PhoneCall size={18} color={COLORS.red[500]} />
              <Text style={[styles.menuItemTitle, { flex: 1, color: COLORS.red[600] }]}>
                Favqulodda SOS yordam
              </Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Ilova sozlamalari</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <Globe size={18} color={COLORS.gray[500]} />
              <Text style={[styles.menuItemTitle, { flex: 1 }]}>Ilova tili</Text>
              <Text style={styles.langValue}>O’zbekcha</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 20,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.gray[900],
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  switchModeCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    ...SHADOWS.md,
  },
  switchIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.amber[500],
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  switchSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
    lineHeight: 16,
  },
  menuSection: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 14,
  },
  langValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.emerald[700],
  },
});
