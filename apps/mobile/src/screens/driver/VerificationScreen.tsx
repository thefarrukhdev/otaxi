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
  ShieldCheck,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  Car,
  AlertCircle,
  UploadCloud,
  FileCheck,
} from 'lucide-react-native';

export const VerificationScreen: React.FC = () => {
  const { verification, uploadDocument, submitVerification } = useApp();

  const handleSimulateUpload = (name: string, type: any) => {
    uploadDocument(type);
    Alert.alert('Yuklandi', `${name} fotosurati muvaffaqiyatli biriktirildi.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Haydovchi Verifikatsiyasi"
        subtitle="Xavfsizlik va xalqaro qatnov uchun hujjatlar tekshiruvi"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Stepper */}
        <View style={styles.stepperCard}>
          <Text style={styles.stepperTitle}>Ariza holati:</Text>

          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <CheckCircle2 size={16} color={COLORS.white} />
              </View>
              <Text style={styles.stepLabel}>Yuborildi</Text>
            </View>

            <View style={[styles.stepLine, styles.stepLineDone]} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <CheckCircle2 size={16} color={COLORS.white} />
              </View>
              <Text style={styles.stepLabel}>Ko’rib chiqildi</Text>
            </View>

            <View style={[styles.stepLine, styles.stepLineDone]} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotApproved]}>
                <ShieldCheck size={18} color={COLORS.white} />
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelApproved]}>Tasdiqlandi</Text>
            </View>
          </View>

          <View style={styles.approvedBanner}>
            <ShieldCheck size={20} color={COLORS.emerald[400]} />
            <Text style={styles.approvedBannerText}>
              Tabriklaymiz! Siz OTAXI platformasida "Tasdiqlangan Xalqaro Haydovchi" maqomiga egasiz.
            </Text>
          </View>
        </View>

        {/* Required Documents List */}
        <Text style={styles.sectionHeading}>Yuklangan rasmiy hujjatlar</Text>

        {/* 1. Driver License */}
        <View style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconBox}>
              <FileText size={20} color={COLORS.emerald[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Haydovchilik guvohnomasi (Prava)</Text>
              <Text style={styles.docSubtitle}>Old va orqa tomoni (B toifa, 2030-yilgacha)</Text>
            </View>
            <Badge label="Tasdiqlangan" variant="emerald" />
          </View>
          <View style={styles.docActionRow}>
            <Text style={styles.docMeta}>Oxirgi tekshiruv: 2025-noyabr</Text>
            <TouchableOpacity
              onPress={() => handleSimulateUpload('Haydovchilik guvohnomasi', 'licenseFront')}
            >
              <Text style={styles.reuploadText}>Qayta yuklash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Vehicle Tech Passport */}
        <View style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconBox}>
              <Car size={20} color={COLORS.emerald[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Avtomobil texpasporti</Text>
              <Text style={styles.docSubtitle}>Chevrolet Malibu 2 (Davlat raqami: 01 A 777 AA)</Text>
            </View>
            <Badge label="Tasdiqlangan" variant="emerald" />
          </View>
          <View style={styles.docActionRow}>
            <Text style={styles.docMeta}>Tegishlilik: Shaxsiy mulk</Text>
            <TouchableOpacity
              onPress={() => handleSimulateUpload('Texpasport', 'techPassport')}
            >
              <Text style={styles.reuploadText}>Qayta yuklash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Insurance & International Green Card */}
        <View style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconBox}>
              <ShieldCheck size={20} color={COLORS.blue[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Majburiy Sug’urta & Yashil Karta</Text>
              <Text style={styles.docSubtitle}>O’zbekiston va Qozog’iston xalqaro sug’urtasi</Text>
            </View>
            <Badge label="Amalda" variant="blue" />
          </View>
          <View style={styles.docActionRow}>
            <Text style={styles.docMeta}>Polis muddati: 2026-dekabrgacha</Text>
            <TouchableOpacity
              onPress={() => handleSimulateUpload('Sug’urta', 'insurance')}
            >
              <Text style={styles.reuploadText}>Qayta yuklash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Car Photos */}
        <View style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconBox}>
              <Camera size={20} color={COLORS.amber[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Avtomobil fotosuratlari (4 ta rasm)</Text>
              <Text style={styles.docSubtitle}>Oldi, orqasi, salon va yukxona ko’rinishi</Text>
            </View>
            <Badge label="Tasdiqlangan" variant="emerald" />
          </View>
          <View style={styles.docActionRow}>
            <Text style={styles.docMeta}>Holati: Toza va soz holatda</Text>
            <TouchableOpacity
              onPress={() => handleSimulateUpload('Avtomobil rasmlari', 'carPhotos')}
            >
              <Text style={styles.reuploadText}>Yangilash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Legal Disclaimer */}
        <View style={styles.legalNotice}>
          <AlertCircle size={16} color={COLORS.navy[400]} />
          <Text style={styles.legalNoticeText}>
            OTAXI haydovchilarining barcha hujjatlari O'zbekiston Respublikasining "Shaxsga doir ma'lumotlar to'g'risida"gi qonuniga muvofiq xavfsiz shifrlangan holda saqlanadi.
          </Text>
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
  stepperCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.navy[700],
    marginBottom: 20,
    ...SHADOWS.md,
  },
  stepperTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy[300],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: COLORS.emerald[600],
  },
  stepDotApproved: {
    backgroundColor: COLORS.emerald[500],
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.navy[800],
    marginHorizontal: 4,
    marginBottom: 20,
  },
  stepLineDone: {
    backgroundColor: COLORS.emerald[600],
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy[300],
  },
  stepLabelApproved: {
    color: COLORS.emerald[400],
    fontWeight: '800',
  },
  approvedBanner: {
    backgroundColor: '#062d1d',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.emerald[800],
  },
  approvedBannerText: {
    fontSize: 12,
    color: COLORS.emerald[200],
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy[300],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  docCard: {
    backgroundColor: COLORS.navy[900],
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.navy[800],
    marginBottom: 12,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
  docSubtitle: {
    fontSize: 11,
    color: COLORS.navy[300],
    marginTop: 2,
  },
  docActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.navy[800],
  },
  docMeta: {
    fontSize: 11,
    color: COLORS.navy[400],
    fontWeight: '500',
  },
  reuploadText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  legalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.navy[900],
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  legalNoticeText: {
    fontSize: 11,
    color: COLORS.navy[400],
    flex: 1,
    lineHeight: 16,
  },
});
