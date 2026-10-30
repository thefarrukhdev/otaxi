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
import { EmptyState, SegmentedControl } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { BookingStatus } from '@otaxi/types';
import {
  Ticket,
  Calendar,
  CheckCircle2,
  History,
  Search,
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
        subtitle="Faol chiptalar va safarlar tarixi"
      />

      {/* Tabs */}
      <SegmentedControl
        items={[
          {
            id: 'ACTIVE',
            label: 'Faol safarlar',
            badge: activeBookings.length,
            icon: (
              <Ticket
                size={15}
                color={activeTab === 'ACTIVE' ? '#0C0D11' : '#94A3B8'}
              />
            ),
          },
          {
            id: 'HISTORY',
            label: 'Safarlar tarixi',
            badge: historyBookings.length,
            icon: (
              <History
                size={15}
                color={activeTab === 'HISTORY' ? '#0C0D11' : '#94A3B8'}
              />
            ),
          },
        ]}
        selectedId={activeTab}
        onSelect={(id) => setActiveTab(id as 'ACTIVE' | 'HISTORY')}
        style={styles.tabContainer}
      />

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
          <EmptyState
            icon={<Ticket size={32} color="#FF8800" strokeWidth={2.4} />}
            title={
              activeTab === 'ACTIVE'
                ? 'Hozircha faol safarlar mavjud emas'
                : "Safarlar tarixi bo'sh"
            }
            description={
              activeTab === 'ACTIVE'
                ? "Yangi shaharlararo yoki xalqaro reys qidirib, o'zingizga qulay o'rindiqni band qiling."
                : 'Bajarilgan va bekor qilingan safarlaringiz shu yerda saqlanadi.'
            }
            actionTitle={activeTab === 'ACTIVE' ? 'Reyslarni qidirish' : undefined}
            onActionPress={activeTab === 'ACTIVE' ? () => navigation.navigate('Home') : undefined}
          />
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
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
