import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@context/AuthContext';
import { AppNavigator } from '../../src/navigation/AppNavigator';
import { Button } from '@components/button';
import { colors, commonStyles } from '@styles/commonStyles';
import { decryptData } from '@utils/encryption';
import { IconSymbol } from '@components/IconSymbol';

const NATURE_COLORS = {
  primary: '#FF3B30',
  primaryLight: '#FFEBEA',
  warning: '#FF9500',
  warningLight: '#FFF4E5',
  background: '#F0F5F2',
  card: '#FFFFFF',
  text: '#3A4A3E',
  textSecondary: '#6B7E72',
  border: '#E0E8E4',
  success: '#34C759',
  blue: '#007AFF',
  highlight: '#D9E6DD',
};

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [emergencyReport, setEmergencyReport] = useState<string | null>(null);


  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will initiate an emergency call. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Emergency',
          style: 'destructive',
          onPress: simulateEmergencyCall,
        },
      ]
    );
  };

  const simulateEmergencyCall = () => {
    Alert.alert(
      'Emergency Call Initiated',
      'Connecting to emergency services...',
      [
        {
          text: 'OK',
          onPress: () => {
            const report = generateEmergencyReport();
            setEmergencyReport(report);
            Alert.alert(
              'Emergency Report Generated',
              'Medical information has been prepared for emergency responders.'
            );
          },
        },
      ]
    );
  };

  const generateEmergencyReport = (): string => {
    if (!user) return 'No user data available';

    const contactName = user.emergencyContactName || 'N/A';
    const contactPhone = user.emergencyContactPhone || 'N/A';

    const report = `
EMERGENCY MEDICAL REPORT
========================
Patient: ${user.firstName} ${user.lastName}
Blood Type: ${user.bloodType}
Weight: ${user.weight}
Allergies: ${user.allergies}
Emergency Contact: ${contactName}
Contact Phone: ${contactPhone}
Last Visit: ${user.lastVisit}

Generated: ${new Date().toLocaleString()}now 
    `.trim();

    return report;
  };



  const callEmergencyNumber = (number: string, service: string) => {
    Alert.alert(
      `Call ${service}`,
      `This will call ${number}. In a real emergency, this would connect you to ${service.toLowerCase()}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Alert.alert('Demo Mode', 'Emergency call simulation completed');
          },
        },
      ]
    );
  };

  const emergencyContact = {
    name: user?.emergencyContactName || 'N/A',
    phone: user?.emergencyContactPhone || 'N/A',
  };

  return (
    <AppNavigator>
      <SafeAreaView style={[commonStyles.wrapper, { backgroundColor: NATURE_COLORS.background }]}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={[commonStyles.scrollViewWithTabBar, styles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={NATURE_COLORS.primary} />
            </View>
            <Text style={styles.headerTitle}>Emergency</Text>
            <Text style={styles.headerSubtitle}>
              Quick access to emergency services and medical information
            </Text>
          </View>

          {/* Main Emergency Call Card */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIconContainer}>
              <View style={styles.emergencyIconOuter}>
                <View style={styles.emergencyIconInner}>
                  <IconSymbol name="phone.fill" size={40} color={NATURE_COLORS.card} />
                </View>
              </View>
            </View>
            <Text style={styles.emergencyTitle}>Emergency Call</Text>
            <Text style={styles.emergencyDescription}>
              Immediate connection to emergency services with automated medical report
            </Text>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={handleEmergencyCall}
              activeOpacity={0.8}
            >
              <IconSymbol name="phone.fill" size={24} color={NATURE_COLORS.card} />
              <Text style={styles.emergencyButtonText}>CALL EMERGENCY</Text>
            </TouchableOpacity>
            <Text style={styles.emergencyNote}>
              Your location and medical info will be shared
            </Text>
          </View>

          {/* Quick Access Numbers */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Quick Access</Text>
              <Text style={styles.cardSubtitle}>Tap to call emergency services</Text>
            </View>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity 
                style={[styles.quickAccessItem, styles.ambulanceItem]}
                onPress={() => callEmergencyNumber('911', 'Ambulance')}
              >
                <View style={styles.quickAccessIcon}>
                  <IconSymbol name="heart.text.square.fill" size={32} color={NATURE_COLORS.primary} />
                </View>
                <Text style={styles.quickAccessLabel}>Ambulance</Text>
                <Text style={styles.quickAccessNumber}>911</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.quickAccessItem, styles.fireItem]}
                onPress={() => callEmergencyNumber('911', 'Fire Department')}
              >
                <View style={styles.quickAccessIcon}>
                  <IconSymbol name="flame.fill" size={32} color={NATURE_COLORS.warning} />
                </View>
                <Text style={styles.quickAccessLabel}>Fire Dept.</Text>
                <Text style={styles.quickAccessNumber}>911</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.quickAccessItem, styles.policeItem]}
                onPress={() => callEmergencyNumber('911', 'Police')}
              >
                <View style={styles.quickAccessIcon}>
                  <IconSymbol name="person.2.fill" size={32} color={NATURE_COLORS.blue} />
                </View>
                <Text style={styles.quickAccessLabel}>Police</Text>
                <Text style={styles.quickAccessNumber}>911</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Medical Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.medicalBadge}>
                  <IconSymbol name="heart.fill" size={16} color={NATURE_COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>Medical Information</Text>
              </View>
            </View>
            
            <View style={styles.medicalGrid}>
              <View style={styles.medicalItem}>
                <View style={styles.medicalItemHeader}>
                  <IconSymbol name="drop.fill" size={18} color={NATURE_COLORS.primary} />
                  <Text style={styles.medicalItemLabel}>Blood Type</Text>
                </View>
                <Text style={styles.medicalItemValue}>{user?.bloodType || 'N/A'}</Text>
              </View>

              <View style={styles.medicalItem}>
                <View style={styles.medicalItemHeader}>
                  <IconSymbol name="scalemass.fill" size={18} color={NATURE_COLORS.warning} />
                  <Text style={styles.medicalItemLabel}>Weight</Text>
                </View>
                <Text style={styles.medicalItemValue}>{user?.weight || 'N/A'}</Text>
              </View>

              <View style={[styles.medicalItem, styles.medicalItemFull]}>
                <View style={styles.medicalItemHeader}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={18} color={NATURE_COLORS.warning} />
                  <Text style={styles.medicalItemLabel}>Allergies</Text>
                </View>
                <Text style={styles.medicalItemValue}>{user?.allergies || 'None reported'}</Text>
              </View>

              <View style={[styles.medicalItem, styles.medicalItemFull, styles.emergencyContactItem]}>
                <View style={styles.medicalItemHeader}>
                  <IconSymbol name="person.fill" size={18} color={NATURE_COLORS.blue} />
                  <Text style={styles.medicalItemLabel}>Emergency Contact</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{emergencyContact.name}</Text>
                  {emergencyContact.phone !== 'N/A' && (
                    <TouchableOpacity style={styles.contactPhoneButton}>
                      <IconSymbol name="phone.fill" size={14} color={NATURE_COLORS.blue} />
                      <Text style={styles.contactPhone}>{emergencyContact.phone}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Emergency Report */}
          {emergencyReport && (
            <View style={[styles.card, styles.reportCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.medicalBadge, styles.successBadge]}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={NATURE_COLORS.success} />
                  </View>
                  <Text style={styles.cardTitle}>Emergency Report</Text>
                </View>
              </View>
              <View style={styles.reportContainer}>
                <Text style={styles.reportText}>{emergencyReport}</Text>
              </View>
              <View style={styles.reportFooter}>
                <IconSymbol name="info.circle.fill" size={16} color={NATURE_COLORS.textSecondary} />
                <Text style={styles.reportNote}>
                  This report contains essential medical information for emergency responders
                </Text>
              </View>
            </View>
          )}

          {/* Emergency Tips */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.medicalBadge, styles.tipsBadge]}>
                  <IconSymbol name="lightbulb.fill" size={16} color={NATURE_COLORS.warning} />
                </View>
                <Text style={styles.cardTitle}>Emergency Tips</Text>
              </View>
            </View>
            <View style={styles.tipsContainer}>
              {[
                { icon: 'exclamationmark.triangle.fill', text: 'Stay calm and speak clearly when calling emergency services' },
                { icon: 'location.fill', text: 'Provide your exact location and any landmarks nearby' },
                { icon: 'heart.text.square.fill', text: 'Mention any allergies or medical conditions immediately' },
                { icon: 'phone.fill', text: 'Keep your phone charged and accessible at all times' },
              ].map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipIconContainer}>
                    <IconSymbol name={tip.icon} size={20} color={NATURE_COLORS.text} />
                  </View>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: NATURE_COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: NATURE_COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: NATURE_COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emergencyCard: {
    backgroundColor: NATURE_COLORS.primaryLight,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: NATURE_COLORS.primary + '30',
    shadowColor: NATURE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyIconContainer: {
    marginBottom: 16,
  },
  emergencyIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NATURE_COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: NATURE_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: NATURE_COLORS.primary,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 15,
    color: NATURE_COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  emergencyButton: {
    backgroundColor: NATURE_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 12,
    shadowColor: NATURE_COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyButtonText: {
    color: NATURE_COLORS.card,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emergencyNote: {
    marginTop: 12,
    fontSize: 12,
    color: NATURE_COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: NATURE_COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: NATURE_COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: NATURE_COLORS.border,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NATURE_COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: NATURE_COLORS.textSecondary,
    marginTop: 2,
  },
  medicalBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: NATURE_COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  successBadge: {
    backgroundColor: NATURE_COLORS.success + '20',
  },
  tipsBadge: {
    backgroundColor: NATURE_COLORS.warningLight,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessItem: {
    flex: 1,
    backgroundColor: NATURE_COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NATURE_COLORS.border,
  },
  ambulanceItem: {
    borderColor: NATURE_COLORS.primary + '30',
    backgroundColor: NATURE_COLORS.primaryLight,
  },
  fireItem: {
    borderColor: NATURE_COLORS.warning + '30',
    backgroundColor: NATURE_COLORS.warningLight,
  },
  policeItem: {
    borderColor: NATURE_COLORS.blue + '30',
    backgroundColor: NATURE_COLORS.blue + '10',
  },
  quickAccessIcon: {
    marginBottom: 8,
  },
  quickAccessEmoji: {
    fontSize: 32,
  },
  quickAccessLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: NATURE_COLORS.text,
    marginBottom: 4,
  },
  quickAccessNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: NATURE_COLORS.primary,
  },
  medicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  medicalItem: {
    flex: 1,
    minWidth: 'calc(50% - 6px)',
    backgroundColor: NATURE_COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: NATURE_COLORS.border,
  },
  medicalItemFull: {
    minWidth: '100%',
  },
  medicalItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  medicalItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: NATURE_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  medicalItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: NATURE_COLORS.text,
  },
  emergencyContactItem: {
    backgroundColor: NATURE_COLORS.blue + '08',
    borderColor: NATURE_COLORS.blue + '20',
  },
  contactInfo: {
    gap: 8,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '700',
    color: NATURE_COLORS.text,
  },
  contactPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  contactPhone: {
    fontSize: 15,
    fontWeight: '600',
    color: NATURE_COLORS.blue,
  },
  reportCard: {
    borderColor: NATURE_COLORS.success + '30',
    backgroundColor: NATURE_COLORS.success + '08',
  },
  reportContainer: {
    backgroundColor: NATURE_COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: NATURE_COLORS.border,
  },
  reportText: {
    fontSize: 12,
    color: NATURE_COLORS.text,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reportNote: {
    flex: 1,
    fontSize: 12,
    color: NATURE_COLORS.textSecondary,
    lineHeight: 18,
  },
  tipsContainer: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NATURE_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: NATURE_COLORS.text,
    lineHeight: 22,
    paddingTop: 10,
  },
});