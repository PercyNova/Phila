
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
    // Simulate emergency call
    Alert.alert(
      'Emergency Call Initiated',
      'Connecting to emergency services...',
      [
        {
          text: 'OK',
          onPress: () => {
            // Generate emergency report
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

    const report = `
EMERGENCY MEDICAL REPORT
========================
Patient: ${user.firstName} ${user.lastName}
Blood Type: ${user.bloodType}
Weight: ${user.weight} kg
Allergies: ${user.allergies}
Emergency Contact: ${getDecryptedData(user.emergencyContact)}
Last Visit: ${user.lastVisit}

Generated: ${new Date().toLocaleString()}
    `.trim();

    return report;
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
      'Call Emergency Services',
      `This will call ${number}. In a real emergency, this would connect you to emergency services.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would make an actual call
            // Linking.openURL(`tel:${number}`);
            Alert.alert('Demo Mode', 'Emergency call simulation completed');
          },
        },
      ]
    );
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={[commonStyles.scrollViewWithTabBar, styles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={commonStyles.title}>Emergency</Text>
            <Text style={commonStyles.textSecondary}>
              Quick access to emergency services
            </Text>
          </View>

          {/* Emergency Call Button */}
          <View style={[commonStyles.card, styles.emergencyCard]}>
            <View style={styles.emergencyIcon}>
              <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.error} />
            </View>
            <Text style={styles.emergencyTitle}>Emergency Call</Text>
            <Text style={styles.emergencyDescription}>
              Press the button below to initiate an emergency call and generate a medical report
            </Text>
            <Button
              title="🚨 CALL EMERGENCY"
              onPress={handleEmergencyCall}
              style={[commonStyles.card, styles.emergencyButton]}
            />
          </View>

          {/* Quick Emergency Numbers */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Emergency Numbers</Text>
            <View style={styles.emergencyNumbers}>
              <Button
                title="🚑 Ambulance (911)"
                onPress={() => callEmergencyNumber('911')}
                variant="outline"
                style={styles.numberButton}
              />
              <Button
                title="🚒 Fire Department (911)"
                onPress={() => callEmergencyNumber('911')}
                variant="outline"
                style={styles.numberButton}
              />
              <Button
                title="👮 Police (911)"
                onPress={() => callEmergencyNumber('911')}
                variant="outline"
                style={styles.numberButton}
              />
            </View>
          </View>

          {/* Medical Information */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Medical Information</Text>
            <View style={styles.medicalInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Blood Type:</Text>
                <Text style={styles.infoValue}>{user?.bloodType}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{user?.weight} kg</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Allergies:</Text>
                <Text style={styles.infoValue}>{user?.allergies}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Emergency Contact:</Text>
                <Text style={styles.infoValue}>
                  {user ? getDecryptedData(user.emergencyContact) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Report */}
          {emergencyReport && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Emergency Report</Text>
              <View style={styles.reportContainer}>
                <Text style={styles.reportText}>{emergencyReport}</Text>
              </View>
              <Text style={styles.reportNote}>
                This report has been generated for emergency responders and contains your essential medical information.
              </Text>
            </View>
          )}

          {/* Emergency Tips */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Emergency Tips</Text>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🆘</Text>
              <Text style={styles.tipText}>
                Stay calm and speak clearly when calling emergency services
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📍</Text>
              <Text style={styles.tipText}>
                Provide your exact location and any landmarks nearby
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🩺</Text>
              <Text style={styles.tipText}>
                Mention any allergies or medical conditions immediately
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={styles.tipText}>
                Keep your phone charged and accessible at all times
              </Text>
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
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding for emergency screen
  },
  header: {
    paddingVertical: 20,
  },
  emergencyCard: {
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    borderWidth: 2,
    borderColor: colors.error + '30',
  },
  emergencyIcon: {
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  emergencyDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emergencyButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minHeight: 60,
    width: '100%',
  },
  emergencyNumbers: {
    gap: 12,
  },
  numberButton: {
    marginBottom: 8,
  },
  medicalInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  reportContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reportText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  reportNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
