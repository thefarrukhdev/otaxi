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
import { useApp } from '../../context/AppContext';
import { Haptics } from '../../components/ui/Haptics';
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
  ChevronRight,
  Globe,
  RefreshCw,
  ExternalLink,
  Shield,
} from 'lucide-react-native';

export const VerificationScreen: React.FC = () => {
  const { verification, uploadDocument, submitVerification } = useApp();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleSimulateUpload = (
    name: string,
    type: 'licenseFront' | 'licenseBack' | 'techPassport' | 'insurance' | 'carPhotos'
  ) => {
    Haptics.medium();
    uploadDocument(type);
    Alert.alert(
      'Hujjat yangilandi',
      `${name} muvaffaqiyatli yuklandi va xavfsizlik xizmati tomonidan tasdiqlandi.`
    );
  };

  const carPhotoSlots = [
    { id: 1, title: 'Old ko’rinish', status: 'Yuklangan' },
    { id: 2, title: 'Orqa ko’rinish', status: 'Yuklangan' },
    { id: 3, title: 'O’ng yon tomon', status: 'Yuklangan' },
    { id: 4, title: 'Salon tozaligi', status: 'Yuklangan' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Haydovchi Verifikatsiyasi"
        subtitle="Rasmiy hujjatlar va xalqaro qatnov litsenziyasi"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Verification Status Stepper Card */}
        <View style={styles.stepperCard}>
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperTitle}>ARIZA VA TEKSHIRUV HOLATI</Text>
            <View style={styles.liveApprovedRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.liveApprovedText}>Tasdiqlangan</Text>
            </View>
          </View>

          {/* Stepper Dots & Line */}
          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <CheckCircle2 size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabel}>1. Yuborildi</Text>
            </View>

            <View style={[styles.stepLine, styles.stepLineDone]} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotDone]}>
                <CheckCircle2 size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabel}>2. Tekshiruv</Text>
            </View>

            <View style={[styles.stepLine, styles.stepLineDone]} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotApproved]}>
                <ShieldCheck size={18} color={COLORS.navy[950]} />
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelApproved]}>3. Tasdiqlandi</Text>
            </View>
          </View>

          {/* Official Verification Banner */}
          <View style={styles.approvedBanner}>
            <View style={styles.approvedIconCircle}>
              <ShieldCheck size={22} color={COLORS.emerald[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.approvedBannerTitle}>
                Tasdiqlangan Xalqaro Haydovchi (Gold Tier)
              </Text>
              <Text style={styles.approvedBannerText}>
                Hujjatlaringiz to’liq tekshirildi. O’zbekiston va Qozog’iston (Toshkent — Shymkent / Olmaota) xalqaro qatnovlariga ruxsat berilgan.
              </Text>
            </View>
          </View>
        </View>

        {/* 4 Required Documents List */}
        <Text style={styles.sectionHeading}>Yuklangan rasmiy hujjatlar (4 ta)</Text>

        {/* 1. Driver License */}
        <View style={styles.docCard}>
          <View style={styles.docTopRow}>
            <View style={styles.docIconBox}>
              <FileText size={20} color={COLORS.amber[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Haydovchilik guvohnomasi (Prava)</Text>
              <Text style={styles.docSubtitle}>Old va orqa tomoni (B toifa, 2030-yilgacha amal qiladi)</Text>
            </View>
            <View style={styles.statusSuccessRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.statusSuccessText}>Tasdiqlangan</Text>
            </View>
          </View>

          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaText}>Seriya: AB 7891234 • 8 yillik tajriba</Text>
            <TouchableOpacity
              style={styles.reuploadBtn}
              onPress={() => handleSimulateUpload('Haydovchilik guvohnomasi', 'licenseFront')}
              activeOpacity={0.7}
            >
              <RefreshCw size={12} color={COLORS.amber[400]} />
              <Text style={styles.reuploadBtnText}>Yangilash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Vehicle Tech Passport */}
        <View style={styles.docCard}>
          <View style={styles.docTopRow}>
            <View style={styles.docIconBox}>
              <Car size={20} color={COLORS.emerald[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Avtomobil texpasporti</Text>
              <Text style={styles.docSubtitle}>
                Chevrolet Malibu 2 (Davlat raqami: 01 A 777 AA, 2023)
              </Text>
            </View>
            <View style={styles.statusSuccessRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.statusSuccessText}>Tasdiqlangan</Text>
            </View>
          </View>

          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaText}>Shaxsiy mulk • Texnik ko’rik: 2026-avgust</Text>
            <TouchableOpacity
              style={styles.reuploadBtn}
              onPress={() => handleSimulateUpload('Texpasport', 'techPassport')}
              activeOpacity={0.7}
            >
              <RefreshCw size={12} color={COLORS.amber[400]} />
              <Text style={styles.reuploadBtnText}>Yangilash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Insurance & International Green Card */}
        <View style={styles.docCard}>
          <View style={styles.docTopRow}>
            <View style={styles.docIconBox}>
              <Shield size={20} color="#38BDF8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Majburiy Sug’urta & Yashil Karta</Text>
              <Text style={styles.docSubtitle}>
                O’zbekiston va Qozog’iston hududida yaroqli xalqaro polis
              </Text>
            </View>
            <View style={styles.statusSuccessRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.statusSuccessText}>Amalda</Text>
            </View>
          </View>

          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaText}>Polis muddati: 2026-dekabrgacha • Oson Sug'urta</Text>
            <TouchableOpacity
              style={styles.reuploadBtn}
              onPress={() => handleSimulateUpload('Sug’urta polisi', 'insurance')}
              activeOpacity={0.7}
            >
              <RefreshCw size={12} color={COLORS.amber[400]} />
              <Text style={styles.reuploadBtnText}>Yangilash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Car Photos (4 Angles) */}
        <View style={styles.docCard}>
          <View style={styles.docTopRow}>
            <View style={styles.docIconBox}>
              <Camera size={20} color={COLORS.amber[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>Avtomobil fotosuratlari (4 ta tomon)</Text>
              <Text style={styles.docSubtitle}>Oldi, orqa, o’ng tomon va salon tozaligi</Text>
            </View>
            <View style={styles.statusSuccessRow}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.statusSuccessText}>4/4 Tayyor</Text>
            </View>
          </View>

          {/* 4 Photo Thumbnails Grid */}
          <View style={styles.photoGrid}>
            {carPhotoSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={styles.photoSlot}
                onPress={() => handleSimulateUpload(`Avtomobil ${slot.title}`, 'carPhotos')}
                activeOpacity={0.75}
              >
                <Camera size={16} color={COLORS.amber[400]} />
                <Text style={styles.photoSlotTitle}>{slot.title}</Text>
                <View style={styles.photoSlotCheck}>
                  <CheckCircle2 size={10} color={COLORS.emerald[400]} />
                  <Text style={styles.photoSlotCheckText}>Tasdiqlangan</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* International Border Mobility Notice (PAS-11) */}
        <View style={styles.borderNoticeCard}>
          <View style={styles.borderNoticeHeader}>
            <Globe size={18} color={COLORS.amber[400]} />
            <Text style={styles.borderNoticeTitle}>
              Xalqaro Chegara Qoidalari Eslatmasi (PAS-11)
            </Text>
          </View>
          <Text style={styles.borderNoticeBody}>
            Qozog’iston yoki Qirg’iziston chegarasidan o’tishda:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Haydovchida qizil xorijiy pasport bo’lishi shart;</Text>
            <Text style={styles.bulletItem}>
              • Avtomobil boshqa shaxs nomida bo’lsa, chet elga chiqish huquqi bilan notarial ishonchnoma;
            </Text>
            <Text style={styles.bulletItem}>
              • Chegara postida har bir yo’lovchining 4 xonali bort kodi tekshirilgan bo’lishi zarur.
            </Text>
          </View>
        </View>

        {/* Help & Support Button */}
        <TouchableOpacity
          style={styles.supportBtn}
          onPress={() => {
            Haptics.light();
            Alert.alert(
              'OTAXI Verifikatsiya Xizmati',
              'Savollaringiz bo’lsa, 24/7 dispetcherlik xizmati bilan bog’laning: +998 71 200 00 00 yoki @otaxi_driver_bot telegram orqali.'
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.supportBtnText}>Hujjatlar bo’yicha yordam va savollar</Text>
          <ExternalLink size={14} color="#94A3B8" />
        </TouchableOpacity>
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
  stepperCard: {
    backgroundColor: '#111827', // Card Graphite
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    marginBottom: 18,
    ...SHADOWS.md,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepperTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  liveApprovedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveApprovedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  stepDotDone: {
    backgroundColor: COLORS.emerald[600],
  },
  stepDotApproved: {
    backgroundColor: COLORS.amber[400],
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1E293B',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  stepLineDone: {
    backgroundColor: COLORS.emerald[600],
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepLabelApproved: {
    color: COLORS.amber[400],
    fontWeight: '800',
  },
  approvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  approvedIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvedBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.emerald[400],
  },
  approvedBannerText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  docCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  docSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  statusSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  docMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  docMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  reuploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reuploadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amber[400],
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  photoSlot: {
    flex: 1,
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  photoSlotTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 6,
    textAlign: 'center',
  },
  photoSlotCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  photoSlotCheckText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.emerald[400],
  },
  borderNoticeCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginTop: 4,
    marginBottom: 16,
  },
  borderNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  borderNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.amber[400],
  },
  borderNoticeBody: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  bulletList: {
    gap: 4,
  },
  bulletItem: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
