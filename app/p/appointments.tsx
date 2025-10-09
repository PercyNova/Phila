import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const NATURE_COLORS = {
  primary: '#8BAF9E',
  background: '#F0F5F2',
  card: '#FFFFFF',
  light: '#EAECE9',
  text: '#3A4A3E',
  textSecondary: '#6B7E72',
  highlight: '#D9E6DD',
  error: '#C96C6C',
  warning: '#D5A06D',
  success: '#8BAF9E',
};

const GRID_BREAKPOINT = 768;

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

  // Native picker
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerValue, setPickerValue] = useState(new Date());

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const isGridActive = screenWidth >= GRID_BREAKPOINT;

  useEffect(() => {
    const onChange = ({ window: { width } }: { window: { width: number } }) => {
      setScreenWidth(width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    loadAppointments();
    return () => subscription.remove();
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
    if (appointmentType === 'routine') {
      if (!selectedDate || !selectedTime) {
        Alert.alert('Error', 'Please select date and time for your routine checkup.');
        return;
      }
    } else if (appointmentType === 'symptom-based') {
      if (!triageResult) {
        Alert.alert('Triage Required', 'Please complete the symptom triage process before booking a symptom-based appointment.');
        return;
      }
    }

    try {
      const appointment = await appointmentService.bookAppointment({
        type: appointmentType,
        date: appointmentType === 'routine' ? selectedDate : 'ASAP',
        time: appointmentType === 'routine' ? selectedTime : 'TBD',
        symptoms: appointmentType === 'symptom-based' ? symptoms : undefined,
        triageResult: triageResult || undefined,
      });

      Alert.alert(
        'Appointment Booked',
        `Your appointment has been scheduled.\nTicket: ${appointment.ticketCode}\n${appointmentType === 'symptom-based' ? `Triage result: ${triageResult?.recommendation}` : ''}`,
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

  // Picker handlers
  const showDatePicker = () => {
    setPickerMode('date');
    setPickerValue(selectedDate ? new Date(selectedDate) : new Date());
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setPickerMode('time');
    setPickerValue(selectedTime ? new Date(`2000/01/01 ${selectedTime}`) : new Date());
    setShowPicker(true);
  };

  const handlePickerChange = (event: any, selected: Date | undefined) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (!selected) return;

    if (pickerMode === 'date') {
      setSelectedDate(selected.toLocaleDateString('en-CA'));
    } else {
      setSelectedTime(selected.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
  };

  const renderTabButton = (tab: typeof activeTab, title: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab
          ? [styles.activeTabButton, { backgroundColor: NATURE_COLORS.primary }]
          : { backgroundColor: NATURE_COLORS.card },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab
            ? [styles.activeTabButtonText, { color: NATURE_COLORS.card }]
            : { color: NATURE_COLORS.textSecondary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return NATURE_COLORS.error + '20';
      case 'medium':
        return NATURE_COLORS.warning + '20';
      case 'low':
        return NATURE_COLORS.success + '20';
      default:
        return NATURE_COLORS.background;
    }
  };

  const renderBookingTab = () => (
    <View>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={pickerValue}
          mode={pickerMode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={handlePickerChange}
        />
      )}

      <View style={isGridActive ? styles.gridContainer : undefined}>
        {/* Appointment Type */}
        <View style={[commonStyles.card, isGridActive && styles.gridItem2]}>
          <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Appointment Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'routine'
                  ? [styles.activeTypeButton, { borderColor: NATURE_COLORS.primary, backgroundColor: NATURE_COLORS.primary + '10' }]
                  : { borderColor: NATURE_COLORS.light + '40' },
              ]}
              onPress={() => {
                setAppointmentType('routine');
                setTriageResult(null);
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  appointmentType === 'routine'
                    ? [styles.activeTypeButtonText, { color: NATURE_COLORS.primary }]
                    : { color: NATURE_COLORS.textSecondary },
                ]}
              >
                🩺 Routine Checkup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'symptom-based'
                  ? [styles.activeTypeButton, { borderColor: NATURE_COLORS.primary, backgroundColor: NATURE_COLORS.primary + '10' }]
                  : { borderColor: NATURE_COLORS.light + '40' },
              ]}
              onPress={() => {
                setAppointmentType('symptom-based');
                setSelectedDate('');
                setSelectedTime('');
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  appointmentType === 'symptom-based'
                    ? [styles.activeTypeButtonText, { color: NATURE_COLORS.primary }]
                    : { color: NATURE_COLORS.textSecondary },
                ]}
              >
                🔍 Symptom Based
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule */}
        <View style={[commonStyles.card, isGridActive && styles.gridItem2]}>
          <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Schedule</Text>

          <InputField
            label="Date"
            value={selectedDate}
            placeholder="Tap to select date"
            labelStyle={{ color: NATURE_COLORS.textSecondary }}
            inputStyle={{ color: NATURE_COLORS.text }}
            onPress={showDatePicker}
            editable={false}
          />

          <InputField
            label="Time"
            value={selectedTime}
            placeholder="Tap to select time"
            labelStyle={{ color: NATURE_COLORS.textSecondary }}
            inputStyle={{ color: NATURE_COLORS.text }}
            onPress={showTimePicker}
            editable={false}
          />
        </View>
      </View>

      {/* Symptoms for Symptom-based */}
      {appointmentType === 'symptom-based' && (
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Symptoms</Text>
            <Button title="Add Symptom" onPress={addSymptom} variant="outline" titleStyle={{ color: NATURE_COLORS.primary }} style={{ borderColor: NATURE_COLORS.light }} />
          </View>

          {symptoms.map((symptom, index) => (
            <View key={index} style={[styles.symptomItem, { backgroundColor: NATURE_COLORS.highlight }]}>
              <InputField
                label="Symptom"
                value={symptom.symptom}
                onChangeText={(text) => {
                  const newSymptoms = [...symptoms];
                  newSymptoms[index].symptom = text;
                  setSymptoms(newSymptoms);
                }}
                placeholder="Describe your symptom"
                labelStyle={{ color: NATURE_COLORS.textSecondary }}
                inputStyle={{ color: NATURE_COLORS.text }}
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
                labelStyle={{ color: NATURE_COLORS.textSecondary }}
                inputStyle={{ color: NATURE_COLORS.text }}
              />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeSymptom(index)}>
                <Text style={[styles.removeButtonText, { color: NATURE_COLORS.error }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {symptoms.length > 0 && (
            <Button title="Run Triage" onPress={runTriage} variant="outline" titleStyle={{ color: NATURE_COLORS.primary }} style={{ borderColor: NATURE_COLORS.light }} />
          )}

          {triageResult && (
            <View style={[styles.triageResult, { backgroundColor: getSeverityColor(triageResult.severity) }]}>
              <Text style={[styles.triageTitle, { color: NATURE_COLORS.text }]}>Triage Result</Text>
              <Text style={[styles.triageSeverity, { color: NATURE_COLORS.text }]}>Severity: {triageResult.severity}</Text>
              <Text style={[styles.triageRecommendation, { color: NATURE_COLORS.text }]}>{triageResult.recommendation}</Text>
            </View>
          )}
        </View>
      )}

      <Button title="Book Appointment" onPress={handleBookAppointment} style={{ backgroundColor: NATURE_COLORS.primary }} />
    </View>
  );

const renderUpcomingTab = () => (
  <View>
    {upcomingAppointments.length > 0 ? (
      upcomingAppointments.map((appointment) => (
        <View key={appointment.id} style={commonStyles.card}>
          <View style={styles.appointmentHeader}>
            <Text style={[styles.appointmentType, { color: NATURE_COLORS.text }]}>
              {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => cancelAppointment(appointment.id)}
            >
              <IconSymbol name="xmark" size={16} color={NATURE_COLORS.error} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.appointmentDate, { color: NATURE_COLORS.textSecondary }]}>
            {appointment.date} at {appointment.time}
          </Text>
          <Text style={[styles.appointmentCode, { color: NATURE_COLORS.primary }]}>
            Ticket: {appointment.ticketCode}
          </Text>
          {appointment.triageResult && (
            <View style={[styles.triageInfo, { backgroundColor: NATURE_COLORS.highlight }]}>
              <Text style={[styles.triageInfoText, { color: NATURE_COLORS.textSecondary }]}>
                Severity: {appointment.triageResult.severity}
              </Text>
            </View>
          )}
        </View>
      ))
    ) : (
      <View style={commonStyles.card}>
        <Text style={[commonStyles.textSecondary, { color: NATURE_COLORS.textSecondary }]}>
          No upcoming appointments
        </Text>
      </View>
    )}
  </View>
);

const renderHistoryTab = () => (
  <View>
    {pastAppointments.length > 0 ? (
      pastAppointments.map((appointment) => (
        <View key={appointment.id} style={commonStyles.card}>
          <Text style={[styles.appointmentType, { color: NATURE_COLORS.text }]}>
            {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
          </Text>
          <Text style={[styles.appointmentDate, { color: NATURE_COLORS.textSecondary }]}>
            {appointment.date} at {appointment.time}
          </Text>
          <Text style={[styles.appointmentCode, { color: NATURE_COLORS.primary }]}>
            Ticket: {appointment.ticketCode}
          </Text>
          <Text style={[styles.appointmentStatus, { color: NATURE_COLORS.success }]}>
            Completed
          </Text>
        </View>
      ))
    ) : (
      <View style={commonStyles.card}>
        <Text style={[commonStyles.textSecondary, { color: NATURE_COLORS.textSecondary }]}>
          No past appointments
        </Text>
      </View>
    )}
  </View>
);

  return (
    <AppNavigator>
      <SafeAreaView style={[commonStyles.wrapper, { backgroundColor: NATURE_COLORS.background }]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[commonStyles.title, { color: NATURE_COLORS.text }]}>Appointments</Text>
            <Text style={[commonStyles.textSecondary, { color: NATURE_COLORS.textSecondary }]}>Book and manage your appointments</Text>
          </View>

          <View style={[styles.tabContainer, { backgroundColor: NATURE_COLORS.card }]}>
            {renderTabButton('book', 'Book')}
            {renderTabButton('upcoming', 'Upcoming')}
            {renderTabButton('history', 'History')}
          </View>

          <ScrollView style={styles.content} contentContainerStyle={commonStyles.scrollViewWithTabBar} showsVerticalScrollIndicator={false}>
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
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingVertical: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -8 },
  gridItem2: { width: '48%', marginBottom: 16, marginHorizontal: 8, flexGrow: 1 },
  tabContainer: { flexDirection: 'row', borderRadius: 8, padding: 4, marginBottom: 16 },
  tabButton: { flex: 1, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  activeTabButton: {},
  tabButtonText: { fontSize: 14, fontWeight: '500' },
  activeTabButtonText: {},
  content: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  typeSelector: { flexDirection: 'row', gap: 12 },
  typeButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, alignItems: 'center' },
  activeTypeButton: {},
  typeButtonText: { fontSize: 14, fontWeight: '500' },
  activeTypeButtonText: {},
  symptomItem: { borderRadius: 8, padding: 12, marginBottom: 12 },
  removeButton: { alignSelf: 'flex-end', padding: 8 },
  removeButtonText: { fontSize: 14, fontWeight: '500' },
  triageResult: { padding: 16, borderRadius: 8, marginTop: 16 },
  triageTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  triageSeverity: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  triageRecommendation: { fontSize: 14, lineHeight: 20 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  appointmentType: { fontSize: 16, fontWeight: '600', textTransform: 'capitalize' },
  appointmentDate: { fontSize: 14, marginBottom: 4 },
  appointmentCode: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
  appointmentStatus: { fontSize: 12, fontWeight: '500' },
  cancelButton: { padding: 8 },
  triageInfo: { padding: 8, borderRadius: 6 },
  triageInfoText: { fontSize: 12 },
});
