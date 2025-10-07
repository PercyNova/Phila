
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { colors, commonStyles } from '@/styles/commonStyles';
import { appointmentService, Appointment } from '@/src/services/appointmentService';
import { triageService, SymptomInput, TriageResult } from '@/src/services/triageService';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'history'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Booking form state
  const [appointmentType, setAppointmentType] = useState<'routine' | 'symptom-based'>('routine');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState('5');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      appointmentService.generateMockAppointments();
      const upcoming = await appointmentService.getUpcomingAppointments();
      const all = await appointmentService.getAllAppointments();
      setUpcomingAppointments(upcoming);
      setAppointments(all);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    if (appointmentType === 'symptom-based' && symptoms.length === 0) {
      Alert.alert('Error', 'Please add at least one symptom');
      return;
    }

    setIsLoading(true);
    try {
      const result = await appointmentService.bookAppointment(
        appointmentType,
        selectedDate,
        selectedTime,
        symptoms.map(s => s.symptom)
      );

      if (result.success) {
        Alert.alert(
          'Appointment Booked',
          `Your appointment has been scheduled.\nTicket Code: ${result.appointment?.ticketCode}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setActiveTab('upcoming');
                loadAppointments();
                resetBookingForm();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSymptoms([]);
    setCurrentSymptom('');
    setCurrentSeverity('5');
    setTriageResult(null);
  };

  const addSymptom = () => {
    if (!currentSymptom.trim()) return;

    const newSymptom: SymptomInput = {
      symptom: currentSymptom.trim(),
      severity: parseInt(currentSeverity),
      duration: '1 day', // Simplified for demo
    };

    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom('');
    setCurrentSeverity('5');
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const runTriage = async () => {
    if (symptoms.length === 0) {
      Alert.alert('Error', 'Please add symptoms first');
      return;
    }

    try {
      const result = await triageService.evaluateSymptoms(symptoms);
      setTriageResult(result);
    } catch (error) {
      console.error('Triage error:', error);
      Alert.alert('Error', 'Failed to evaluate symptoms');
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await appointmentService.cancelAppointment(appointmentId);
              loadAppointments();
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const renderTabButton = (tab: typeof activeTab, title: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderBookingTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.subtitle}>Book New Appointment</Text>
        
        {/* Appointment Type */}
        <Text style={styles.sectionLabel}>Appointment Type</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              appointmentType === 'routine' && styles.activeTypeButton,
            ]}
            onPress={() => setAppointmentType('routine')}
          >
            <Text style={[
              styles.typeButtonText,
              appointmentType === 'routine' && styles.activeTypeButtonText,
            ]}>
              🩺 Routine Checkup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              appointmentType === 'symptom-based' && styles.activeTypeButton,
            ]}
            onPress={() => setAppointmentType('symptom-based')}
          >
            <Text style={[
              styles.typeButtonText,
              appointmentType === 'symptom-based' && styles.activeTypeButtonText,
            ]}>
              🔍 Symptom-Based
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time */}
        <InputField
          label="Preferred Date"
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="YYYY-MM-DD"
        />
        <InputField
          label="Preferred Time"
          value={selectedTime}
          onChangeText={setSelectedTime}
          placeholder="HH:MM"
        />

        {/* Symptoms (for symptom-based appointments) */}
        {appointmentType === 'symptom-based' && (
          <>
            <Text style={styles.sectionLabel}>Symptoms</Text>
            <View style={styles.symptomInput}>
              <InputField
                label="Describe your symptom"
                value={currentSymptom}
                onChangeText={setCurrentSymptom}
                placeholder="e.g., headache, fever, cough"
              />
              <InputField
                label="Severity (1-10)"
                value={currentSeverity}
                onChangeText={setCurrentSeverity}
                keyboardType="numeric"
                placeholder="5"
              />
              <Button
                title="Add Symptom"
                onPress={addSymptom}
                variant="outline"
              />
            </View>

            {symptoms.length > 0 && (
              <View style={styles.symptomsList}>
                <Text style={styles.symptomsTitle}>Added Symptoms:</Text>
                {symptoms.map((symptom, index) => (
                  <View key={index} style={styles.symptomItem}>
                    <View style={styles.symptomInfo}>
                      <Text style={styles.symptomText}>{symptom.symptom}</Text>
                      <Text style={styles.symptomSeverity}>
                        Severity: {symptom.severity}/10
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeSymptom(index)}
                      style={styles.removeButton}
                    >
                      <IconSymbol name="xmark" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <View style={styles.triageActions}>
                  <Button
                    title="🔍 Run Triage Assessment"
                    onPress={runTriage}
                    variant="outline"
                    style={styles.triageButton}
                  />
                  <Button
                    title="📋 Full Triage Page"
                    onPress={() => router.push('/triage')}
                    variant="outline"
                    style={styles.triageButton}
                  />
                </View>
              </View>
            )}

            {triageResult && (
              <View style={[styles.triageResult, { borderColor: getSeverityColor(triageResult.severity) }]}>
                <Text style={styles.triageTitle}>Triage Assessment</Text>
                <Text style={[styles.triageSeverity, { color: getSeverityColor(triageResult.severity) }]}>
                  Severity: {triageResult.severity.toUpperCase()}
                </Text>
                <Text style={styles.triageUrgency}>{triageResult.urgency}</Text>
                <Text style={styles.triageRecommendation}>{triageResult.recommendation}</Text>
              </View>
            )}
          </>
        )}

        <Button
          title="Book Appointment"
          onPress={handleBookAppointment}
          loading={isLoading}
          style={styles.bookButton}
        />
      </View>
    </ScrollView>
  );

  const renderUpcomingTab = () => (
    <ScrollView style={styles.tabContent}>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <View key={appointment.id} style={commonStyles.card}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentType}>
                {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
              </Text>
              <Text style={[styles.appointmentStatus, { color: colors.success }]}>
                {appointment.status}
              </Text>
            </View>
            <Text style={styles.appointmentDate}>
              📅 {appointment.date} at {appointment.time}
            </Text>
            <Text style={styles.appointmentTicket}>
              🎫 Ticket: {appointment.ticketCode}
            </Text>
            {appointment.symptoms && (
              <Text style={styles.appointmentSymptoms}>
                Symptoms: {appointment.symptoms.join(', ')}
              </Text>
            )}
            <Button
              title="Cancel Appointment"
              onPress={() => cancelAppointment(appointment.id)}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        ))
      ) : (
        <View style={commonStyles.card}>
          <Text style={commonStyles.textSecondary}>No upcoming appointments</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent}>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <View key={appointment.id} style={commonStyles.card}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentType}>
                {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
              </Text>
              <Text style={[
                styles.appointmentStatus,
                { color: appointment.status === 'completed' ? colors.success : colors.error }
              ]}>
                {appointment.status}
              </Text>
            </View>
            <Text style={styles.appointmentDate}>
              📅 {appointment.date} at {appointment.time}
            </Text>
            <Text style={styles.appointmentTicket}>
              🎫 Ticket: {appointment.ticketCode}
            </Text>
            {appointment.symptoms && (
              <Text style={styles.appointmentSymptoms}>
                Symptoms: {appointment.symptoms.join(', ')}
              </Text>
            )}
          </View>
        ))
      ) : (
        <View style={commonStyles.card}>
          <Text style={commonStyles.textSecondary}>No appointment history</Text>
        </View>
      )}
    </ScrollView>
  );

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return colors.error;
      case 'high': return colors.warning;
      case 'medium': return colors.secondary;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Appointments</Text>
            <Text style={commonStyles.textSecondary}>
              Manage your healthcare appointments
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {renderTabButton('upcoming', 'Upcoming')}
            {renderTabButton('book', 'Book New')}
            {renderTabButton('history', 'History')}
          </View>

          {/* Tab Content */}
          {activeTab === 'book' && renderBookingTab()}
          {activeTab === 'upcoming' && renderUpcomingTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.card,
  },
  tabContent: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.textSecondary + '40',
    alignItems: 'center',
  },
  activeTypeButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTypeButtonText: {
    color: colors.primary,
  },
  symptomInput: {
    marginBottom: 16,
  },
  symptomsList: {
    marginBottom: 16,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  symptomSeverity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  removeButton: {
    padding: 8,
  },
  triageActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  triageButton: {
    flex: 1,
  },
  triageResult: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  triageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  triageSeverity: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  triageUrgency: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  triageRecommendation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bookButton: {
    marginTop: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  appointmentStatus: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  appointmentDate: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  appointmentTicket: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  appointmentSymptoms: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
});
