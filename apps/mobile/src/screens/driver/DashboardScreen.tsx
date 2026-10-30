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
import { Button, Card, Badge, PriceDisplay } from '../../components/ui';
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
        <Card variant="surface" style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
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
        </Card>

        {/* Verification Status Banner */}
        <Card
          variant="surface"
          pressable
          style={styles.verificationBanner}
          onPress={() => {
            Haptics.light();
            navigation.navigate('Verification');
          }}
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
        </Card>

        {/* Financial & Performance 2x2 Stats Grid */}
        <View style={styles.statsGrid}>
          {/* 1. Wallet Balance */}
          <Card
            variant="surface"
            pressable
            style={styles.statBox}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('Wallet');
            }}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#2A1805' }]}>
                <Wallet size={18} color="#FF8800" />
              </View>
              <Text style={styles.statHint}>Pul yechish ➔</Text>
            </View>
            <Text style={styles.statLabel}>Hamyon balansi</Text>
            <PriceDisplay amount={driverBalance} currency="UZS" size="md" />
            <Text style={styles.statSubText}>0% komissiya bilan yechish</Text>
          </Card>

          {/* 2. Today's Earnings */}
          <Card variant="surface" style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#0D2818' }]}>
                <TrendingUp size={18} color={COLORS.emerald[400]} />
              </View>
            </View>
            <Text style={styles.statLabel}>Bugungi tushum</Text>
            <PriceDisplay amount={324000} currency="UZS" size="md" />
            <Text style={styles.statSubText}>Kechagiga nisbatan o’sish</Text>
          </Card>

          {/* 3. Rating */}
          <Card variant="surface" style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#2A2005' }]}>
                <Star size={18} color="#FACC15" fill="#FACC15" />
              </View>
            </View>
            <Text style={styles.statLabel}>Haftalik reyting</Text>
            <Text style={styles.statValue}>4.95</Text>
            <Text style={styles.statSubText}>128 ta yo’lovchi bahosi</Text>
          </Card>

          {/* 4. Total Trips */}
          <Card variant="surface" style={styles.statBox}>
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#0A1E38' }]}>
                <Car size={18} color="#38BDF8" />
              </View>
            </View>
            <Text style={styles.statLabel}>Bajarilgan safarlar</Text>
            <Text style={styles.statValue}>185 ta</Text>
            <Text style={styles.statSubText}>Muvaffaqiyatli qatnovlar</Text>
          </Card>
        </View>

        {/* Next Scheduled Trip Card (Navbatdagi Reys) */}
        <Card variant="surface" style={styles.nextTripCard}>
          <View style={styles.nextTripHeader}>
            <View style={styles.nextTripRouteWrap}>
              <View style={styles.tagRow}>
                <Text style={styles.nextTripTag}>NAVBATDAGI REYS</Text>
                {activeDriverTrip.isInternational && (
                  <Badge label="Xalqaro" variant="brand" size="sm" />
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
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight size={16} color="#0C0D11" />}
            title={`Faol reysni boshqarish (${bookedCount} ta yo'lovchi)`}
            onPress={() => {
              Haptics.medium();
              navigation.navigate('ActiveTrip');
            }}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeading}>Tezkor amallar</Text>
        <View style={styles.actionsGrid}>
          {/* Create Trip */}
          <Card
            variant="surface"
            pressable
            style={styles.actionCard}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('CreateTrip');
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#2A1805' }]}>
              <PlusCircle size={22} color="#FF8800" />
            </View>
            <Text style={styles.actionTitle}>Yangi reys e’lon qilish</Text>
            <Text style={styles.actionDesc}>Shaharlararo yoki xalqaro chegara yo’nalishi</Text>
            <View style={styles.actionFooter}>
              <Text style={styles.actionFooterText}>Reys yaratish</Text>
              <ArrowRight size={13} color="#FF8800" />
            </View>
          </Card>

          {/* Wallet Payout */}
          <Card
            variant="surface"
            pressable
            style={styles.actionCard}
            onPress={() => {
              Haptics.selection();
              navigation.navigate('Wallet');
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#0D2818' }]}>
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
          </Card>
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
    backgroundColor: '#15171E',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  statusCardOffline: {
    backgroundColor: '#15171E',
    borderColor: '#272B35',
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
    backgroundColor: '#15171E',
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
    backgroundColor: '#15171E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#272B35',
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
    backgroundColor: '#15171E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#272B35',
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
    borderColor: '#272B35',
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
    backgroundColor: '#15171E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#272B35',
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
