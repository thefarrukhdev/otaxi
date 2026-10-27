import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';
import { BoardingPassCard } from '../../components/BoardingPassCard';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { useApp } from '../../context/AppContext';
import { POPULAR_ROUTES, getBorderChecklist } from '../../lib/data';
import { CountryCode } from '@otaxi/types';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Compass,
  FileCheck2,
} from 'lucide-react-native';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { activeBooking, cancelBooking } = useApp();
  const [fromCity, setFromCity] = useState('Toshkent');
  const [toCity, setToCity] = useState('');
  const [passengersCount, setPassengersCount] = useState(1);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  const handleSearch = () => {
    navigation.navigate('TripsList', {
      from: fromCity,
      to: toCity,
      passengers: passengersCount,
    });
  };

  const handleSelectPopularRoute = (route: (typeof POPULAR_ROUTES)[0]) => {
    setFromCity(route.from);
    setToCity(route.to);
    navigation.navigate('TripsList', {
      from: route.from,
      to: route.to,
      passengers: passengersCount,
      isInternational: route.isInternational,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Shaharlararo va xalqaro safarlar"
        subtitle="Markaziy Osiyo bo’ylab tekshirilgan haydovchilar bilan xavfsiz sayohat"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Active Booking Reminder if passenger has one */}
        {activeBooking && (
          <View style={styles.activeBookingSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Sizning faol safaringiz</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                <Text style={styles.linkText}>Barchasini ko’rish</Text>
              </TouchableOpacity>
            </View>
            <BoardingPassCard
              booking={activeBooking}
              onOpenChecklist={() => setChecklistVisible(true)}
              onCancelBooking={(id) => cancelBooking(id)}
            />
          </View>
        )}

        {/* Search Hero Card */}
        <View style={styles.searchCard}>
          <View style={styles.searchCardHeader}>
            <View style={styles.searchTypePill}>
              <Sparkles size={14} color={COLORS.emerald[700]} />
              <Text style={styles.searchTypePillText}>Shaharlararo & Xalqaro qatnov</Text>
            </View>
          </View>

          {/* From Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconCircle}>
              <MapPin size={16} color={COLORS.emerald[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Qayerdan</Text>
              <TextInput
                style={styles.textInput}
                value={fromCity}
                onChangeText={setFromCity}
                placeholder="Shahar nomi (Masalan: Toshkent)"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputDivider} />

          {/* To Input */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputIconCircle, { backgroundColor: COLORS.blue[50] }]}>
              <Compass size={16} color={COLORS.blue[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Qayerga</Text>
              <TextInput
                style={styles.textInput}
                value={toCity}
                onChangeText={setToCity}
                placeholder="Shahar nomi (Shymkent, Samarqand...)"
                placeholderTextColor={COLORS.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputDivider} />

          {/* Options row: Date & Passengers count */}
          <View style={styles.optionsRow}>
            <View style={styles.optionBox}>
              <Calendar size={16} color={COLORS.gray[500]} />
              <View>
                <Text style={styles.optionLabel}>Jo’nash sanasi</Text>
                <Text style={styles.optionValue}>Bugun, 15-iyun</Text>
              </View>
            </View>

            <View style={styles.optionBox}>
              <Users size={16} color={COLORS.gray[500]} />
              <View>
                <Text style={styles.optionLabel}>Yo’lovchilar</Text>
                <View style={styles.passengersCounter}>
                  <TouchableOpacity
                    onPress={() => setPassengersCount((p) => Math.max(1, p - 1))}
                    style={styles.counterBtn}
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{passengersCount}</Text>
                  <TouchableOpacity
                    onPress={() => setPassengersCount((p) => Math.min(4, p + 1))}
                    style={styles.counterBtn}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.85}>
            <Search size={18} color={COLORS.white} />
            <Text style={styles.searchButtonText}>Reyslarni qidirish</Text>
          </TouchableOpacity>
        </View>

        {/* International Border Guide Quick Banner */}
        <TouchableOpacity
          style={styles.borderBanner}
          onPress={() => setChecklistVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.borderBannerIconCircle}>
            <Globe size={22} color={COLORS.blue[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.borderBannerTitle}>Xalqaro chegara yordamchisi</Text>
              <Badge label="PRD PAS-11" variant="blue" />
            </View>
            <Text style={styles.borderBannerSubtitle}>
              Qozog’iston, Qirg’iziston va Tojikiston chegaralariga tayyorgarlik chek-listi
            </Text>
          </View>
          <ArrowRight size={18} color={COLORS.blue[600]} />
        </TouchableOpacity>

        {/* Popular Routes Carousel */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Mashhur yo’nalishlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {POPULAR_ROUTES.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.routeCard}
                onPress={() => handleSelectPopularRoute(item)}
                activeOpacity={0.8}
              >
                <View style={styles.routeBadgeRow}>
                  <Badge
                    label={item.isInternational ? 'Xalqaro' : 'Shaharlararo'}
                    variant={item.isInternational ? 'blue' : 'emerald'}
                  />
                  <Text style={styles.routeTime}>{item.time}</Text>
                </View>
                <Text style={styles.routeFromTo}>
                  {item.from} ➔ {item.to}
                </Text>
                <Text style={styles.routePrice}>{item.price} dan</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Platform Advantages */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Nega aynan OTAXI?</Text>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.emerald[50] }]}>
              <ShieldCheck size={22} color={COLORS.emerald[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>100% Tekshirilgan haydovchilar</Text>
              <Text style={styles.featureText}>
                Har bir haydovchining shaxsi, haydovchilik guvohnomasi, avtomobil texpasporti va sug’urtasi qat’iy tekshiriladi.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.blue[50] }]}>
              <FileCheck2 size={22} color={COLORS.blue[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Chegara qoidalari chek-listi</Text>
              <Text style={styles.featureText}>
                Xorijiy pasport, vizasiz muddat, bolalar ruxsatnomasi va valyuta me’yorlari to’lovdan oldin to’liq ko’rsatiladi.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.amber[50] }]}>
              <Sparkles size={22} color={COLORS.amber[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Interaktiv joy tanlash & Kafolat</Text>
              <Text style={styles.featureText}>
                Old o’rindiq yoki orqa qulay joyni oldindan tanlaysiz. 4 xonali bortga chiqish kodi bilan safaringiz kafolatlangan.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Border Checklist Modal */}
      <BorderChecklistModal
        visible={isChecklistVisible}
        onClose={() => setChecklistVisible(false)}
        checklist={getBorderChecklist(CountryCode.UZ, CountryCode.KZ)}
      />
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
    paddingBottom: 32,
  },
  activeBookingSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald[700],
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.gray[200],
    ...SHADOWS.md,
    marginBottom: 16,
  },
  searchCardHeader: {
    marginBottom: 12,
  },
  searchTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emerald[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  searchTypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald[800],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  inputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 10,
    color: COLORS.gray[400],
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textInput: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    paddingVertical: 2,
  },
  inputDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  optionBox: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  optionLabel: {
    fontSize: 9,
    color: COLORS.gray[400],
    fontWeight: '700',
  },
  optionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray[800],
  },
  passengersCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  counterBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 4,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.gray[800],
  },
  counterValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emerald[800],
  },
  searchButton: {
    backgroundColor: COLORS.emerald[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    ...SHADOWS.md,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  borderBanner: {
    backgroundColor: '#f0f7ff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.blue[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  borderBannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  borderBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.blue[900],
  },
  borderBannerSubtitle: {
    fontSize: 11,
    color: COLORS.blue[700],
    marginTop: 2,
    lineHeight: 16,
  },
  popularSection: {
    marginBottom: 20,
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  routeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    width: 170,
    marginRight: 10,
    ...SHADOWS.sm,
  },
  routeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTime: {
    fontSize: 10,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
  routeFromTo: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  routePrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[700],
  },
  featuresSection: {
    marginTop: 8,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.gray[600],
    lineHeight: 16,
  },
});
