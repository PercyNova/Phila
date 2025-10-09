
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
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'history'>('book');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

  // Booking form state
  const [appointmentType, setAppointmentType] = useState<'routine' | 'symptom-based'>('routine');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      appointmentService.generateMockAppointments();
      const upcoming = await appointmentService.getUpcomingAppointments();
      const past = await appointmentService.getPastAppointments();
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    try {
      const appointment = await appointmentService.bookAppointment({
        type: appointmentType,
        date: selectedDate,
        time: selectedTime,
        symptoms: appointmentType === 'symptom-based' ? symptoms : undefined,
        triageResult: triageResult || undefined,
      });

      Alert.alert(
        'Appointment Booked',
        `Your appointment has been scheduled.\nTicket: ${appointment.ticketCode}`,
        [{ text: 'OK', onPress: resetBookingForm }]
      );

      loadAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  const resetBookingForm = () => {
    setAppointmentType('routine');
    setSelectedDate('');
    setSelectedTime('');
    setSymptoms([]);
    setTriageResult(null);
  };

  const addSymptom = () => {
    setSymptoms([...symptoms, { symptom: '', severity: 'mild', duration: '' }]);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const runTriage = async () => {
    if (symptoms.length === 0) {
      Alert.alert('Error', 'Please add at least one symptom');
      return;
    }

    try {
      const result = await triageService.evaluateSymptoms(symptoms);
      setTriageResult(result);
      Alert.alert('Triage Complete', result.recommendation);
    } catch (error) {
      console.error('Error running triage:', error);
      Alert.alert('Error', 'Failed to run triage evaluation');
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
              Alert.alert('Success', 'Appointment cancelled');
              loadAppointments();
            } catch (error) {
              console.error('Error cancelling appointment:', error);
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
    <View>
      <View style={commonStyles.card}>
        <Text style={commonStyles.subtitle}>Appointment Type</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              appointmentType === 'routine' && styles.activeTypeButton,
            ]}
            onPress={() => setAppointmentType('routine')}
          >
            <Text
              style={[
                styles.typeButtonText,
                appointmentType === 'routine' && styles.activeTypeButtonText,
              ]}
            >
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
            <Text
              style={[
                styles.typeButtonText,
                appointmentType === 'symptom-based' && styles.activeTypeButtonText,
              ]}
            >
              🔍 Symptom Based
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.subtitle}>Schedule</Text>
        <InputField
          label="Date"
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="YYYY-MM-DD"
        />
        <InputField
          label="Time"
          value={selectedTime}
          onChangeText={setSelectedTime}
          placeholder="HH:MM"
        />
      </View>

      {appointmentType === 'symptom-based' && (
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={commonStyles.subtitle}>Symptoms</Text>
            <Button title="Add Symptom" onPress={addSymptom} variant="outline" />
          </View>

          {symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <InputField
                label="Symptom"
                value={symptom.symptom}
                onChangeText={(text) => {
                  const newSymptoms = [...symptoms];
                  newSymptoms[index].symptom = text;
                  setSymptoms(newSymptoms);
                }}
                placeholder="Describe your symptom"
              />
              <InputField
                label="Duration"
                value={symptom.duration}
                onChangeText={(text) => {
                  const newSymptoms = [...symptoms];
                  newSymptoms[index].duration = text;
                  setSymptoms(newSymptoms);
                }}
                placeholder="How long have you had this?"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeSymptom(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {symptoms.length > 0 && (
            <Button title="Run Triage" onPress={runTriage} variant="outline" />
          )}

          {triageResult && (
            <View style={[styles.triageResult, { backgroundColor: getSeverityColor(triageResult.severity) }]}>
              <Text style={styles.triageTitle}>Triage Result</Text>
              <Text style={styles.triageSeverity}>Severity: {triageResult.severity}</Text>
              <Text style={styles.triageRecommendation}>{triageResult.recommendation}</Text>
            </View>
          )}
        </View>
      )}

      <Button title="Book Appointment" onPress={handleBookAppointment} />
    </View>
  );

  const renderUpcomingTab = () => (
    <View>
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
          <View key={appointment.id} style={commonStyles.card}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentType}>
                {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelAppointment(appointment.id)}
              >
                <IconSymbol name="xmark" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
            <Text style={styles.appointmentDate}>
              {appointment.date} at {appointment.time}
            </Text>
            <Text style={styles.appointmentCode}>Ticket: {appointment.ticketCode}</Text>
            {appointment.triageResult && (
              <View style={styles.triageInfo}>
                <Text style={styles.triageInfoText}>
                  Severity: {appointment.triageResult.severity}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={commonStyles.card}>
          <Text style={commonStyles.textSecondary}>No upcoming appointments</Text>
        </View>
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <View>
      {pastAppointments.length > 0 ? (
        pastAppointments.map((appointment) => (
          <View key={appointment.id} style={commonStyles.card}>
            <Text style={styles.appointmentType}>
              {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
            </Text>
            <Text style={styles.appointmentDate}>
              {appointment.date} at {appointment.time}
            </Text>
            <Text style={styles.appointmentCode}>Ticket: {appointment.ticketCode}</Text>
            <Text style={[styles.appointmentStatus, { color: colors.success }]}>
              Completed
            </Text>
          </View>
        ))
      ) : (
        <View style={commonStyles.card}>
          <Text style={commonStyles.textSecondary}>No past appointments</Text>
        </View>
      )}
    </View>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return colors.error + '20';
      case 'medium':
        return colors.warning + '20';
      case 'low':
        return colors.success + '20';
      default:
        return colors.background;
    }
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={commonStyles.title}>Appointments</Text>
            <Text style={commonStyles.textSecondary}>
              Book and manage your appointments
            </Text>
          </View>

          <View style={styles.tabContainer}>
            {renderTabButton('book', 'Book')}
            {renderTabButton('upcoming', 'Upcoming')}
            {renderTabButton('history', 'History')}
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={commonStyles.scrollViewWithTabBar}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'book' && renderBookingTab()}
            {activeTab === 'upcoming' && renderUpcomingTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.card,
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
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
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTypeButtonText: {
    color: colors.primary,
  },
  symptomItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  removeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  triageResult: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  triageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  triageSeverity: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  triageRecommendation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appointmentCode: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  appointmentStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 8,
  },
  triageInfo: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 6,
  },
  triageInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
