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
import {
  Car,
  Star,
  Wallet,
  Calendar,
  Users,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react-native';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { driverBalance, activeDriverTrip, verification } = useApp();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        title="Haydovchi Boshqaruv Paneli"
        subtitle="Xush kelibsiz, Alisher Usmonov"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Online/Offline Status Bar */}
        <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusIndicatorDot,
                { backgroundColor: isOnline ? COLORS.emerald[500] : COLORS.gray[400] },
              ]}
            />
            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? 'Safarga tayyorman (Online)' : 'Dam olish rejimi (Offline)'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'Yo’lovchilar sizning reyslaringizni ko’rib, bron qilishlari mumkin'
                  : 'Yangi buyurtmalar qabul qilinmaydi'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: COLORS.gray[600], true: COLORS.emerald[500] }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* Verification Status Pill */}
        <TouchableOpacity
          style={styles.verificationBanner}
          onPress={() => navigation.navigate('Verification')}
          activeOpacity={0.85}
        >
          <ShieldCheck size={20} color={COLORS.emerald[400]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.verificationBannerTitle}>Tekshirilgan Haydovchi</Text>
            <Text style={styles.verificationBannerDesc}>
              Barcha hujjatlaringiz tasdiqlangan va xalqaro qatnovga ruxsat berilgan
            </Text>
          </View>
          <ArrowRight size={16} color={COLORS.navy[300]} />
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.statIconWrapper}>
              <Wallet size={18} color={COLORS.amber[400]} />
            </View>
            <Text style={styles.statLabel}>Hamyon balansi</Text>
            <Text style={styles.statValue}>
              {driverBalance.toLocaleString('uz-UZ')} UZS
            </Text>
            <Text style={styles.statHint}>Pul yechish ➔</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#1e3a5f' }]}>
              <TrendingUp size={18} color="#38bdf8" />
            </View>
            <Text style={styles.statLabel}>Bugungi daromad</Text>
            <Text style={styles.statValue}>324,000 UZS</Text>
            <Text style={styles.statHint}>+15% kechagiga nisbatan</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#3b2f15' }]}>
              <Star size={18} color="#facc15" fill="#facc15" />
            </View>
            <Text style={styles.statLabel}>Reyting</Text>
            <Text style={styles.statValue}>4.95 ★</Text>
            <Text style={styles.statHint}>128 ta baho</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#133e29' }]}>
              <Car size={18} color={COLORS.emerald[400]} />
            </View>
            <Text style={styles.statLabel}>Bajarilgan safarlar</Text>
            <Text style={styles.statValue}>185 ta</Text>
            <Text style={styles.statHint}>100% muvaffaqiyat</Text>
          </View>
        </View>

        {/* Next Scheduled Trip */}
        <View style={styles.nextTripCard}>
          <View style={styles.nextTripHeader}>
            <View>
              <Text style={styles.nextTripTag}>NAVBATDAGI REYS</Text>
              <Text style={styles.nextTripRoute}>
                {activeDriverTrip.originCity} ➔ {activeDriverTrip.destinationCity}
              </Text>
            </View>
            <Badge
              label={activeDriverTrip.isInternational ? 'Xalqaro' : 'Shaharlararo'}
              variant={activeDriverTrip.isInternational ? 'blue' : 'emerald'}
            />
          </View>

          <View style={styles.nextTripDetails}>
            <View style={styles.nextTripDetailItem}>
              <Calendar size={14} color={COLORS.navy[300]} />
              <Text style={styles.nextTripDetailText}>{activeDriverTrip.departureTime}</Text>
            </View>

            <View style={styles.nextTripDetailItem}>
              <Users size={14} color={COLORS.navy[300]} />
              <Text style={styles.nextTripDetailText}>
                3 / 4 ta yo’lovchi band qilgan
              </Text>
            </View>

            <View style={styles.nextTripDetailItem}>
              <Car size={14} color={COLORS.navy[300]} />
              <Text style={styles.nextTripDetailText}>
                {activeDriverTrip.vehicle.make} {activeDriverTrip.vehicle.model} ({activeDriverTrip.vehicle.licensePlate})
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.manageTripBtn}
            onPress={() => navigation.navigate('ActiveTrip')}
            activeOpacity={0.85}
          >
            <Text style={styles.manageTripBtnText}>Faol reysni boshqarish (Bortga olish)</Text>
            <ArrowRight size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeading}>Tezkor amallar</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CreateTrip')}
            activeOpacity={0.85}
          >
            <PlusCircle size={24} color={COLORS.emerald[400]} />
            <Text style={styles.actionTitle}>Yangi reys e’lon qilish</Text>
            <Text style={styles.actionDesc}>Shaharlararo yoki xalqaro yo’nalish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.85}
          >
            <Wallet size={24} color={COLORS.amber[400]} />
            <Text style={styles.actionTitle}>Hamyon & Pul yechish</Text>
            <Text style={styles.actionDesc}>0% komissiya bilan Uzcard/Humo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[950],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
  },
  statusCardOnline: {
    backgroundColor: COLORS.navy[900],
    borderColor: COLORS.emerald[600],
  },
  statusCardOffline: {
    backgroundColor: COLORS.navy[900],
    borderColor: COLORS.navy[700],
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  statusSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
  },
  verificationBanner: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.emerald[800],
  },
  verificationBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  verificationBannerDesc: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 16,
    padding: 14,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    ...SHADOWS.sm,
  },
  statIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.navy[400],
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: 4,
  },
  statHint: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  nextTripCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.navy[700],
    marginBottom: 20,
    ...SHADOWS.md,
  },
  nextTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nextTripTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.amber[400],
    letterSpacing: 0.5,
  },
  nextTripRoute: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 2,
  },
  nextTripDetails: {
    gap: 8,
    backgroundColor: COLORS.navy[950],
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  nextTripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextTripDetailText: {
    fontSize: 12,
    color: COLORS.navy[200],
    fontWeight: '600',
  },
  manageTripBtn: {
    backgroundColor: COLORS.emerald[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.sm,
  },
  manageTripBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[300],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    gap: 6,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 4,
  },
  actionDesc: {
    fontSize: 10,
    color: COLORS.navy[400],
    lineHeight: 14,
  },
});
