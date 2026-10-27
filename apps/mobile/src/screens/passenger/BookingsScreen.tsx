import React, { useState } from 'react';
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
import { BoardingPassCard } from '../../components/BoardingPassCard';
import { BorderChecklistModal } from '../../components/BorderChecklistModal';
import { useApp } from '../../context/AppContext';
import { getBorderChecklist } from '../../lib/data';
import { BookingStatus } from '@otaxi/types';
import { Ticket, Calendar, CheckCircle2, History } from 'lucide-react-native';

interface BookingsScreenProps {
  navigation: any;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({ navigation }) => {
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [selectedTripForChecklist, setSelectedTripForChecklist] = useState<any | null>(null);

  const activeBookings = bookings.filter((b) => b.status === BookingStatus.CONFIRMED);
  const historyBookings = bookings.filter((b) => b.status !== BookingStatus.CONFIRMED);

  const displayedList = activeTab === 'ACTIVE' ? activeBookings : historyBookings;

  return (
    <View style={styles.container}>
      <Header
        title="Mening safarlarim"
        subtitle="Bortga chiqish chiptalari va safarlar tarixi"
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ACTIVE' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.tabTextActive]}>
            Faol safarlar ({activeBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'HISTORY' && styles.tabBtnActive]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabText, activeTab === 'HISTORY' && styles.tabTextActive]}>
            Tarix ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {displayedList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ticket size={48} color={COLORS.gray[300]} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'ACTIVE' ? 'Faol safarlar mavjud emas' : 'Safarlar tarixi bo’sh'}
            </Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'ACTIVE'
                ? 'Yangi shaharlararo yoki xalqaro reys qidirib, o’rindiqni band qiling.'
                : 'Bajarilgan safarlaringiz shu yerda saqlanadi.'}
            </Text>
            {activeTab === 'ACTIVE' && (
              <TouchableOpacity
                style={styles.findTripsBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.findTripsBtnText}>Reys qidirish</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayedList.map((booking) => (
            <BoardingPassCard
              key={booking.id}
              booking={booking}
              onOpenChecklist={() => setSelectedTripForChecklist(booking.trip)}
              onCancelBooking={(id) => cancelBooking(id)}
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
    backgroundColor: COLORS.gray[50],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 6,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...SHADOWS.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: COLORS.emerald[600],
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[600],
  },
  tabTextActive: {
    color: COLORS.white,
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
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray[800],
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  findTripsBtn: {
    marginTop: 20,
    backgroundColor: COLORS.emerald[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...SHADOWS.md,
  },
  findTripsBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
