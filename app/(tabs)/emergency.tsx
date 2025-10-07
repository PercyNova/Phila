
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { Button } from '@/src/components/Button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { decryptData } from '@/src/utils/encryption';
import { IconSymbol } from '@/components/IconSymbol';

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyReport, setEmergencyReport] = useState<string | null>(null);

  const handleEmergencyCall = async () => {
    Alert.alert(
      '🚨 Emergency Call',
      'This will initiate an emergency call. In a real app, this would call 911/112.',
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

  const simulateEmergencyCall = async () => {
    setIsEmergencyActive(true);
    
    // Simulate emergency call process
    setTimeout(() => {
      generateEmergencyReport();
    }, 3000);
  };

  const generateEmergencyReport = () => {
    const report = `
EMERGENCY CALL REPORT
Generated: ${new Date().toLocaleString()}

PATIENT INFORMATION:
Name: ${user?.firstName} ${user?.lastName}
Phone: ${getDecryptedData(user?.phone || '')}
Emergency Contact: ${getDecryptedData(user?.emergencyContact || '')}

MEDICAL INFORMATION:
Blood Type: ${user?.bloodType}
Weight: ${user?.weight} kg
Height: ${user?.height} cm
Allergies: ${user?.allergies}

MEDICAL HISTORY:
${user?.medicalHistory?.map(condition => `• ${getDecryptedData(condition)}`).join('\n') || 'None recorded'}

CURRENT MEDICATIONS:
${user?.medications?.map(medication => `• ${getDecryptedData(medication)}`).join('\n') || 'None recorded'}

CALL STATUS: Emergency services notified
LOCATION: GPS coordinates would be shared in real implementation
ESTIMATED ARRIVAL: 8-12 minutes

This report has been automatically shared with emergency responders.
    `;

    setEmergencyReport(report);
    setIsEmergencyActive(false);
    
    Alert.alert(
      'Emergency Services Contacted',
      'Emergency services have been notified. Help is on the way. A detailed medical report has been prepared for the responders.',
      [{ text: 'OK' }]
    );
  };

  const getDecryptedData = (encryptedData: string): string => {
    try {
      return decryptData(encryptedData);
    } catch {
      return encryptedData;
    }
  };

  const callEmergencyNumber = (number: string) => {
    Alert.alert(
      'Call Emergency Number',
      `This would call ${number} in a real app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app: Linking.openURL(`tel:${number}`);
            console.log(`Would call ${number}`);
          },
        },
      ]
    );
  };

  if (isEmergencyActive) {
    return (
      <SafeAreaView style={[commonStyles.wrapper, styles.emergencyActive]}>
        <View style={styles.emergencyContainer}>
          <View style={styles.emergencyIcon}>
            <IconSymbol name="exclamationmark.triangle.fill" size={80} color={colors.card} />
          </View>
          <Text style={styles.emergencyTitle}>Emergency Call Active</Text>
          <Text style={styles.emergencySubtitle}>
            Contacting emergency services...
          </Text>
          <Text style={styles.emergencyInfo}>
            Please stay on the line. Help is on the way.
          </Text>
          <View style={styles.loadingDots}>
            <Text style={styles.loadingText}>●●●</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Emergency</Text>
            <Text style={commonStyles.textSecondary}>
              Quick access to emergency services
            </Text>
          </View>

          {/* Main Emergency Button */}
          <View style={[commonStyles.card, styles.emergencyCard]}>
            <View style={styles.emergencyButtonContainer}>
              <Button
                title="🚨 EMERGENCY CALL"
                onPress={handleEmergencyCall}
                variant="emergency"
                style={styles.emergencyButton}
              />
              <Text style={styles.emergencyNote}>
                Tap to call emergency services (911/112)
              </Text>
            </View>
          </View>

          {/* Quick Contact Numbers */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Quick Contact</Text>
            
            <View style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>🚑 Emergency Services</Text>
                <Text style={styles.contactNumber}>911 / 112</Text>
              </View>
              <Button
                title="Call"
                onPress={() => callEmergencyNumber('911')}
                variant="outline"
                style={styles.contactButton}
              />
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>🏥 Poison Control</Text>
                <Text style={styles.contactNumber}>1-800-222-1222</Text>
              </View>
              <Button
                title="Call"
                onPress={() => callEmergencyNumber('1-800-222-1222')}
                variant="outline"
                style={styles.contactButton}
              />
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>🧠 Mental Health Crisis</Text>
                <Text style={styles.contactNumber}>988</Text>
              </View>
              <Button
                title="Call"
                onPress={() => callEmergencyNumber('988')}
                variant="outline"
                style={styles.contactButton}
              />
            </View>
          </View>

          {/* Medical Information Summary */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Medical Information Summary</Text>
            <Text style={styles.infoNote}>
              This information will be shared with emergency responders
            </Text>
            
            <View style={styles.medicalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Blood Type:</Text>
                <Text style={styles.infoValue}>{user?.bloodType}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Allergies:</Text>
                <Text style={styles.infoValue}>{user?.allergies}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Emergency Contact:</Text>
                <Text style={styles.infoValue}>
                  {getDecryptedData(user?.emergencyContact || '')}
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Tips */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Emergency Tips</Text>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🩹</Text>
              <Text style={styles.tipText}>
                Stay calm and speak clearly when calling emergency services
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📍</Text>
              <Text style={styles.tipText}>
                Know your exact location or nearest landmark
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💊</Text>
              <Text style={styles.tipText}>
                Have your medical information and medications list ready
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>👥</Text>
              <Text style={styles.tipText}>
                Don&apos;t hang up until the operator tells you to
              </Text>
            </View>
          </View>

          {/* Emergency Report */}
          {emergencyReport && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Last Emergency Report</Text>
              <ScrollView style={styles.reportContainer} nestedScrollEnabled>
                <Text style={styles.reportText}>{emergencyReport}</Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </AppNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  emergencyCard: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
    borderWidth: 2,
  },
  emergencyButtonContainer: {
    alignItems: 'center',
  },
  emergencyButton: {
    width: '100%',
    minHeight: 80,
    marginBottom: 12,
  },
  emergencyNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  infoNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  medicalInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  reportContainer: {
    maxHeight: 200,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  reportText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 100,
  },
  // Emergency Active Styles
  emergencyActive: {
    backgroundColor: colors.error,
  },
  emergencyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emergencyIcon: {
    marginBottom: 32,
  },
  emergencyTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencySubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.card,
    textAlign: 'center',
    marginBottom: 24,
  },
  emergencyInfo: {
    fontSize: 16,
    color: colors.card,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loadingDots: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: colors.card,
    fontWeight: '700',
  },
});
