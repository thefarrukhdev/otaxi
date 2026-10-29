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
import { Haptics } from '../../components/ui/Haptics';
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
  Zap,
  CheckCircle2,
} from 'lucide-react-native';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { driverBalance, activeDriverTrip, verification } = useApp();
  const [isOnline, setIsOnline] = useState(true);

  const handleToggleOnline = (value: boolean) => {
    Haptics.medium();
    setIsOnline(value);
  };

  const bookedCount = activeDriverTrip.passengers.length;
  const totalSeats = activeDriverTrip.totalSeats;
  const availableSeats = Math.max(0, totalSeats - bookedCount);

  return (
    <View style={styles.container}>
      <Header
        title="Haydovchi Boshqaruv Paneli"
        subtitle="Alisher Usmonov • Chevrolet Malibu 2"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Online / Offline Cockpit Toggle Card */}
        <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusIndicatorDot,
                { backgroundColor: isOnline ? COLORS.emerald[400] : '#64748B' },
              ]}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.statusTitleRow}>
                <Text style={styles.statusTitle}>
                  {isOnline ? 'Safarga tayyorman' : 'Dam olish rejimi'}
                </Text>
              </View>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'Yo’lovchilar reyslaringizni real vaqtda bron qilishlari mumkin'
                  : 'Yangi buyurtmalar vaqtinchalik qabul qilinmaydi'}
              </Text>
            </View>
          </View>

          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: '#1E293B', true: COLORS.emerald[500] }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Verification Status Banner */}
        <TouchableOpacity
          style={styles.verificationBanner}
          onPress={() => {
            Haptics.light();
            navigation.navigate('Verification');
          }}
          activeOpacity={0.85}
        >
          <View style={styles.verifIconBox}>
            <ShieldCheck size={20} color={COLORS.emerald[400]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.verificationBannerTitle}>Tasdiqlangan Xalqaro Haydovchi</Text>
            <Text style={styles.verificationBannerDesc}>
              Barcha rasmiy hujjatlar tasdiqlangan: xalqaro va shahar qatnoviga ruxsat
            </Text>
          </View>
          <ArrowRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        {/* Financial & Performance 2x2 Stats Grid */}
        <View style={styles.statsGrid}>
          {/* 1. Wallet Balance */}
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('Wallet');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Wallet size={18} color={COLORS.amber[400]} />
              </View>
              <Text style={styles.statHint}>Pul yechish ➔</Text>
            </View>
            <Text style={styles.statLabel}>Hamyon balansi</Text>
            <Text style={styles.statValueAmber}>
              {driverBalance.toLocaleString('uz-UZ')}{' '}
              <Text style={styles.statCurrency}>UZS</Text>
            </Text>
            <Text style={styles.statSubText}>0% komissiya bilan yechish</Text>
          </TouchableOpacity>

          {/* 2. Today's Earnings */}
          <View style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <TrendingUp size={18} color={COLORS.emerald[400]} />
              </View>
            </View>
            <Text style={styles.statLabel}>Bugungi tushum</Text>
            <Text style={styles.statValueEmerald}>
              324,000 <Text style={styles.statCurrency}>UZS</Text>
            </Text>
            <Text style={styles.statSubText}>Kechagiga nisbatan o’sish</Text>
          </View>

          {/* 3. Rating */}
          <View style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(250, 204, 21, 0.15)' }]}>
                <Star size={18} color="#FACC15" fill="#FACC15" />
              </View>
            </View>
            <Text style={styles.statLabel}>Haftalik reyting</Text>
            <Text style={styles.statValue}>4.95 ★</Text>
            <Text style={styles.statSubText}>128 ta yo’lovchi bahosi</Text>
          </View>

          {/* 4. Total Trips */}
          <View style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Car size={18} color="#38BDF8" />
              </View>
            </View>
            <Text style={styles.statLabel}>Bajarilgan safarlar</Text>
            <Text style={styles.statValue}>185 ta</Text>
            <Text style={styles.statSubText}>Muvaffaqiyatli qatnovlar</Text>
          </View>
        </View>

        {/* Next Scheduled Trip Card (Navbatdagi Reys) */}
        <View style={styles.nextTripCard}>
          <View style={styles.nextTripHeader}>
            <View style={styles.nextTripRouteWrap}>
              <View style={styles.tagRow}>
                <Text style={styles.nextTripTag}>NAVBATDAGI REYS</Text>
                {activeDriverTrip.isInternational && (
                  <Text style={styles.intlFlagText}>🇰🇿 Xalqaro</Text>
                )}
              </View>

              <Text style={styles.nextTripRoute}>
                {activeDriverTrip.originCity} ➔ {activeDriverTrip.destinationCity}
              </Text>
              <Text style={styles.nextTripAddress}>
                {activeDriverTrip.originAddress}
              </Text>
            </View>
          </View>

          {/* Trip Details Grid */}
          <View style={styles.nextTripDetailsGrid}>
            <View style={styles.tripDetailItem}>
              <Clock size={14} color={COLORS.amber[400]} />
              <View>
                <Text style={styles.tripDetailLabel}>Jo’nash vaqti</Text>
                <Text style={styles.tripDetailValue}>{activeDriverTrip.departureTime}</Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <Users size={14} color={COLORS.emerald[400]} />
              <View>
                <Text style={styles.tripDetailLabel}>Band qilingan</Text>
                <Text style={styles.tripDetailValue}>
                  {bookedCount} / {totalSeats} ta joy ({availableSeats} ta bo’sh)
                </Text>
              </View>
            </View>

            <View style={styles.tripDetailItem}>
              <Car size={14} color="#38BDF8" />
              <View>
                <Text style={styles.tripDetailLabel}>Avtomobil</Text>
                <Text style={styles.tripDetailValue}>
                  {activeDriverTrip.vehicle.make} {activeDriverTrip.vehicle.model} • {activeDriverTrip.vehicle.licensePlate}
                </Text>
              </View>
            </View>
          </View>

          {/* Manage Trip CTA Button */}
          <TouchableOpacity
            style={styles.manageTripBtn}
            onPress={() => {
              Haptics.medium();
              navigation.navigate('ActiveTrip');
            }}
            activeOpacity={0.85}
          >
            <View style={styles.manageTripBtnContent}>
              <Text style={styles.manageTripBtnText}>Faol reysni boshqarish</Text>
              <Text style={styles.manageTripBtnSubText}>
                {bookedCount} ta yo’lovchi kodi va qabul qilish
              </Text>
            </View>
            <View style={styles.manageTripArrowCircle}>
              <ArrowRight size={16} color={COLORS.navy[950]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeading}>Tezkor amallar</Text>
        <View style={styles.actionsGrid}>
          {/* Create Trip */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('CreateTrip');
            }}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <PlusCircle size={22} color={COLORS.amber[400]} />
            </View>
            <Text style={styles.actionTitle}>Yangi reys e’lon qilish</Text>
            <Text style={styles.actionDesc}>Shaharlararo yoki xalqaro chegara yo’nalishi</Text>
            <View style={styles.actionFooter}>
              <Text style={styles.actionFooterText}>Reys yaratish</Text>
              <ArrowRight size={13} color={COLORS.amber[400]} />
            </View>
          </TouchableOpacity>

          {/* Wallet Payout */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('Wallet');
            }}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Wallet size={22} color={COLORS.emerald[400]} />
            </View>
            <Text style={styles.actionTitle}>Hamyon & Pul yechish</Text>
            <Text style={styles.actionDesc}>0% komissiya bilan bir zumda Uzcard/Humo/Kaspi</Text>
            <View style={styles.actionFooter}>
              <Text style={[styles.actionFooterText, { color: COLORS.emerald[400] }]}>
                Pul yechish
              </Text>
              <ArrowRight size={13} color={COLORS.emerald[400]} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16', // Cockpit Obsidian
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statusCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1.5,
    ...SHADOWS.md,
  },
  statusCardOnline: {
    backgroundColor: '#111827',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  statusCardOffline: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  statusIndicatorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 15,
  },
  verificationBanner: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    ...SHADOWS.sm,
  },
  verifIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  verificationBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  verificationBannerDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    ...SHADOWS.sm,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statHint: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  statValueAmber: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.amber[400],
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  statValueEmerald: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.emerald[400],
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  statCurrency: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  statSubText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  nextTripCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  nextTripHeader: {
    marginBottom: 14,
  },
  nextTripRouteWrap: {
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nextTripTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.amber[400],
    letterSpacing: 0.8,
  },
  intlFlagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8800',
  },
  nextTripRoute: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  nextTripAddress: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  nextTripDetailsGrid: {
    backgroundColor: '#090D16',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 14,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tripDetailLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  tripDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 1,
  },
  manageTripBtn: {
    backgroundColor: COLORS.amber[400],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.md,
  },
  manageTripBtnContent: {
    flex: 1,
  },
  manageTripBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[950],
  },
  manageTripBtnSubText: {
    fontSize: 11,
    color: 'rgba(2, 6, 23, 0.75)',
    marginTop: 1,
    fontWeight: '600',
  },
  manageTripArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(2, 6, 23, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    justifyContent: 'space-between',
    minHeight: 140,
    ...SHADOWS.sm,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 17,
  },
  actionDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 14,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  actionFooterText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
});
