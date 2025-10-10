import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions, 
} from 'react-native';
// FIX APPLIED HERE:
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAuth } from '@context/AuthContext';
import { AppNavigator } from '../../src/navigation/AppNavigator';
import { Button } from '@components/button';
import { InputField } from '@components/InputField';
// Assuming you import colors and commonStyles like this:
import { colors as existingColors, commonStyles } from '@styles/commonStyles'; 
import { decryptData } from '@utils/encryption';
import { appointmentService } from '@services/appointmentService';
import { IconSymbol } from '@components/IconSymbol';

// --- NEW LIGHT GREEN PASTELL COLOR PALETTE ---
const NATURE_COLORS = {
  // Primary Action Color: A soft, muted green
  primary: '#8BAF9E', // Sage Green
  // Background for the overall screen (or commonStyles.wrapper)
  background: '#F0F5F2', // Very Light Mint/Off-White
  // Color for cards and elements that need to pop slightly
  card: '#FFFFFF', // Clean White
  // Light color for secondary elements/dividers/input backgrounds
  light: '#EAECE9', // Pale Gray-Green
  // Main text color (Darker for readability)
  text: '#3A4A3E', // Dark Moss Green
  // Secondary text color (Lighter than main text)
  textSecondary: '#6B7E72', // Muted Gray-Green
  // Appointment/Highlight background
  highlight: '#D9E6DD', // Pale Mint Green
};
// ---------------------------------------------


const GRID_BREAKPOINT = 768; 

export default function HomeScreen() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ weight: '', allergies: '' });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window: { width } }: { window: { width: number } }) => {
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    if (user) {
      setEditData({
        weight: user.weight,
        allergies: user.allergies,
      });
      loadUpcomingAppointments();
    }
    
    return () => subscription.remove();
  }, [user]);

  const isGridActive = screenWidth >= GRID_BREAKPOINT;

  const loadUpcomingAppointments = async () => {
    try {
      appointmentService.generateMockAppointments();
      const appointments = await appointmentService.getUpcomingAppointments();
      setUpcomingAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleSaveChanges = () => {
    if (user) {
      const updatedUser = {
        ...user,
        weight: editData.weight,
        allergies: editData.allergies,
      };
      updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Your information has been updated');
    }
  };



  const getDecryptedData = (encryptedData: string): string => {
    try {
      return decryptData(encryptedData);
    } catch {
      return encryptedData;
    }
  };

  const gridCardStyle = isGridActive ? styles.gridCard : {};
  const healthCardStyle = isGridActive ? styles.healthGridCard : styles.healthCard;
  
  return (
    // Assuming commonStyles.wrapper sets the main background color
    <SafeAreaView style={[commonStyles.wrapper, { backgroundColor: NATURE_COLORS.background }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={commonStyles.scrollViewWithTabBar}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[commonStyles.title, { color: NATURE_COLORS.text }]}>
              Welcome back, {user?.firstName}!
            </Text>
            <Text style={[commonStyles.textSecondary, { color: NATURE_COLORS.textSecondary }]}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Grid Container for Main Content */}
        <View style={isGridActive ? styles.gridContainer : undefined}>
          
          {/* Quick Health Info */}
          {/* Note: commonStyles.card needs to be updated in its source file to use NATURE_COLORS.card for background, 
              but we can override it here if necessary */}
          <View style={[commonStyles.card, healthCardStyle, isGridActive && styles.gridItem1]}>
            <View style={styles.cardHeader}>
              <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Quick Health Info</Text>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}
              >
                <IconSymbol
                  name={isEditing ? 'checkmark' : 'pencil'}
                  size={20}
                  // Using the new primary color for the edit icon
                  color={NATURE_COLORS.primary} 
                />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View>
                {/* InputField component would need to be updated to use NATURE_COLORS for text/border/background */}
                <InputField
                  label="Weight (kg)"
                  value={editData.weight}
                  onChangeText={(text) => setEditData({ ...editData, weight: text })}
                  keyboardType="numeric"
                  placeholder="Enter your weight"
                  // Assuming InputField accepts custom styles
                  labelStyle={{ color: NATURE_COLORS.textSecondary }} 
                  inputStyle={{ color: NATURE_COLORS.text }}
                />
                <InputField
                  label="Allergies"
                  value={editData.allergies}
                  onChangeText={(text) => setEditData({ ...editData, allergies: text })}
                  placeholder="Enter any allergies"
                  multiline
                  labelStyle={{ color: NATURE_COLORS.textSecondary }}
                  inputStyle={{ color: NATURE_COLORS.text }}
                />
                <View style={styles.editActions}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setIsEditing(false);
                      setEditData({
                        weight: user?.weight || '',
                        allergies: user?.allergies || '',
                      });
                    }}
                    variant="outline"
                    // Button component needs to handle the new NATURE_COLORS.primary
                    style={[styles.actionButton, { borderColor: NATURE_COLORS.primary }]}
                    titleStyle={{ color: NATURE_COLORS.primary }}
                  />
                  <Button
                    title="Save"
                    onPress={handleSaveChanges}
                    // Button component needs to handle the new NATURE_COLORS.primary
                    style={[styles.actionButton, { backgroundColor: NATURE_COLORS.primary }]}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.healthInfo}>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Weight:</Text>
                  <Text style={styles.healthValue}>{user?.weight} kg</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Blood Type:</Text>
                  <Text style={styles.healthValue}>{user?.bloodType}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Allergies:</Text>
                  <Text style={styles.healthValue}>{user?.allergies}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>Last Visit:</Text>
                  <Text style={styles.healthValue}>{user?.lastVisit}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Upcoming Appointments */}
          <View style={[commonStyles.card, gridCardStyle, styles.appointmentsCard, isGridActive && styles.gridItem2]}>
            <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Upcoming Appointments</Text>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                // Use the light/highlight color for the appointment background
                <View key={appointment.id} style={[styles.appointmentItem, { backgroundColor: NATURE_COLORS.highlight }]}>
                  <View style={styles.appointmentInfo}>
                    <Text style={[styles.appointmentType, { color: NATURE_COLORS.text }]}>
                      {appointment.type === 'routine' ? <IconSymbol name="heart.text.square.fill" size={16} color={NATURE_COLORS.text} /> : <IconSymbol name="magnifyingglass" size={16} color={NATURE_COLORS.text} />} {appointment.type.replace('-', ' ')}
                    </Text>
                    <Text style={[styles.appointmentDate, { color: NATURE_COLORS.textSecondary }]}>
                      {appointment.date} at {appointment.time}
                    </Text>
                    <Text style={[styles.appointmentCode, { color: NATURE_COLORS.primary }]}>
                      Ticket: {appointment.ticketCode}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[commonStyles.textSecondary, { color: NATURE_COLORS.textSecondary }]}>No upcoming appointments</Text>
            )}
          </View>

          {/* Health Recommendations */}
          <View style={[commonStyles.card, gridCardStyle, isGridActive && styles.gridItem3]}>
            <Text style={[commonStyles.subtitle, { color: NATURE_COLORS.text }]}>Health Recommendations</Text>
            <View style={styles.recommendation}>
              <IconSymbol name="drop.fill" size={20} color={NATURE_COLORS.text} />
              <Text style={[styles.recommendationText, { color: NATURE_COLORS.text }]}>
                Stay hydrated - aim for 8 glasses of water daily
              </Text>
            </View>
            <View style={styles.recommendation}>
              <IconSymbol name="figure.walk" size={20} color={NATURE_COLORS.text} />
              <Text style={[styles.recommendationText, { color: NATURE_COLORS.text }]}>
                Take a 30-minute walk today for better cardiovascular health
              </Text>
            </View>
            <View style={styles.recommendation}>
              <IconSymbol name="powersleep" size={20} color={NATURE_COLORS.text} />
              <Text style={[styles.recommendationText, { color: NATURE_COLORS.text }]}>
                Maintain 7-9 hours of sleep for optimal recovery
              </Text>
            </View>
          </View>
          
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Note: I have to redefine the styles here to incorporate the new NATURE_COLORS
// as I cannot edit the imported commonStyles. The original commonStyles usage 
// is kept but colors are explicitly overridden with inline styles or in the local StyleSheet.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  
  // --- Grid Styles ---
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8, 
  },
  gridCard: {
    marginBottom: 16,
    marginHorizontal: 8, 
    flexGrow: 1, 
  },
  healthGridCard: {
    marginBottom: 16,
    marginHorizontal: 8,
    flexGrow: 1,
  },
  gridItem1: {
    width: '48%', 
  },
  gridItem2: {
    width: '48%', 
  },
  gridItem3: {
    width: '100%', 
  },
  // Overriding/Default styles
  healthCard: {
    marginBottom: 16,
  },
  appointmentsCard: {
    minHeight: 250, 
  },
  // --- End Grid Styles ---
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    padding: 8,
  },
  healthInfo: {
    gap: 12,
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 16,
    // Using new secondary text color
    color: NATURE_COLORS.textSecondary,
    fontWeight: '500',
  },
  healthValue: {
    fontSize: 16,
    // Using new main text color
    color: NATURE_COLORS.text,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  appointmentItem: {
    // Overridden with inline style to use NATURE_COLORS.highlight
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  appointmentInfo: {
    gap: 4,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    // Overridden with inline style to use NATURE_COLORS.text
    textTransform: 'capitalize',
  },
  appointmentDate: {
    fontSize: 14,
    // Overridden with inline style to use NATURE_COLORS.textSecondary
  },
  appointmentCode: {
    fontSize: 12,
    // Overridden with inline style to use NATURE_COLORS.primary
    fontWeight: '500',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    // Overridden with inline style to use NATURE_COLORS.text
    lineHeight: 20,
  },
  demoButton: {
    marginTop: 8,
  },
});