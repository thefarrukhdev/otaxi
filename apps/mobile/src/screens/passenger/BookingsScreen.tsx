import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { COLORS, SHADOWS } from '../../lib/theme';
import { Header } from '../../components/Header';
import { BoardingPassCard } from '../../components/BoardingPassCard';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { Haptics } from '../../components/ui/Haptics';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { BookingStatus } from '@otaxi/types';
import {
  Ticket,
  Calendar,
  CheckCircle2,
  History,
  Search,
  Sparkles,
  Compass,
} from 'lucide-react-native';

interface BookingsScreenProps {
  navigation: any;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({ navigation }) => {
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [selectedTripForChecklist, setSelectedTripForChecklist] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === BookingStatus.CONFIRMED),
    [bookings]
  );

  const historyBookings = useMemo(
    () => bookings.filter((b) => b.status !== BookingStatus.CONFIRMED),
    [bookings]
  );

  const displayedList = activeTab === 'ACTIVE' ? activeBookings : historyBookings;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleCancel = (bookingId: string) => {
    Haptics.warning();
    Alert.alert(
      'Safarni bekor qilish',
      'Safarni bekor qilmoqchimisiz? Reys jo\'nashiga 2 soatdan ko\'p vaqt qolganda to\'lov 100% qaytariladi.',
      [
        { text: 'Yo\'q, qolsin', style: 'cancel' },
        {
          text: 'Bekor qilish',
          style: 'destructive',
          onPress: () => {
            Haptics.error();
            cancelBooking(bookingId);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Mening safarlarim"
        subtitle="Aviachipta uslubidagi dinamik bort chiptalari va safarlar tarixi"
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ACTIVE' && styles.tabBtnActive]}
          onPress={() => {
            Haptics.light();
            setActiveTab('ACTIVE');
          }}
          activeOpacity={0.8}
        >
          <View style={styles.tabBtnInner}>
            <Ticket
              size={15}
              color={activeTab === 'ACTIVE' ? '#0C0D11' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'ACTIVE' && styles.tabTextActive,
              ]}
            >
              Faol safarlar ({activeBookings.length})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'HISTORY' && styles.tabBtnActive]}
          onPress={() => {
            Haptics.light();
            setActiveTab('HISTORY');
          }}
          activeOpacity={0.8}
        >
          <View style={styles.tabBtnInner}>
            <History
              size={15}
              color={activeTab === 'HISTORY' ? '#0C0D11' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'HISTORY' && styles.tabTextActive,
              ]}
            >
              Safarlar tarixi ({historyBookings.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#FF8800']}
            tintColor="#FF8800"
          />
        }
      >
        {displayedList.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Ticket size={44} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'ACTIVE'
                ? 'Hozircha faol safarlar mavjud emas'
                : 'Safarlar tarixi bo\'sh'}
            </Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'ACTIVE'
                ? 'Yangi shaharlararo yoki xalqaro reys qidirib, o\'zingizga qulay o\'rindiqni band qiling.'
                : 'Bajarilgan va bekor qilingan safarlaringiz shu yerda saqlanadi.'}
            </Text>
            {activeTab === 'ACTIVE' && (
              <TouchableOpacity
                style={styles.findTripsBtn}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
              >
                <Compass size={16} color="#0C0D11" strokeWidth={2.5} />
                <Text style={styles.findTripsBtnText}>Reyslarni qidirish</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayedList.map((booking) => (
            <BoardingPassCard
              key={booking.id}
              booking={booking}
              onOpenChecklist={() => setSelectedTripForChecklist(booking.trip)}
              onCancelBooking={handleCancel}
            />
          ))
        )}
      </ScrollView>

      {/* Border Checklist Modal if triggered */}
      {selectedTripForChecklist && (
        <BorderChecklistModal
          visible={!!selectedTripForChecklist}
          onClose={() => setSelectedTripForChecklist(null)}
          checklist={getBorderChecklist(
            selectedTripForChecklist.originCountry,
            selectedTripForChecklist.destinationCountry
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D11',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#15171E',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FF8800',
  },
  tabBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#0C0D11',
    fontWeight: '900',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#15171E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#272B35',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  findTripsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF8800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  findTripsBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0C0D11',
  },
});
