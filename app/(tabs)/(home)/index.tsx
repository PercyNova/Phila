
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { colors, commonStyles } from '@/styles/commonStyles';
import { decryptData } from '@/src/utils/encryption';
import { appointmentService } from '@/src/services/appointmentService';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const { user, switchToRandomUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ weight: '', allergies: '' });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setEditData({
        weight: user.weight,
        allergies: user.allergies,
      });
      loadUpcomingAppointments();
    }
  }, [user]);

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

  const handleSwitchUser = () => {
    Alert.alert(
      'Switch User',
      'This will switch to a different mock user for demo purposes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () => {
            switchToRandomUser();
            Alert.alert('Success', 'Switched to a new demo user');
          },
        },
      ]
    );
  };

  const getDecryptedData = (encryptedData: string): string => {
    try {
      return decryptData(encryptedData);
    } catch {
      return encryptedData;
    }
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={commonStyles.scrollViewWithTabBar}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={commonStyles.title}>
                Welcome back, {user?.firstName}!
              </Text>
              <Text style={commonStyles.textSecondary}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Quick Health Info */}
          <View style={[commonStyles.card, styles.healthCard]}>
            <View style={styles.cardHeader}>
              <Text style={commonStyles.subtitle}>Quick Health Info</Text>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}
              >
                <IconSymbol
                  name={isEditing ? 'checkmark' : 'pencil'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View>
                <InputField
                  label="Weight (kg)"
                  value={editData.weight}
                  onChangeText={(text) => setEditData({ ...editData, weight: text })}
                  keyboardType="numeric"
                  placeholder="Enter your weight"
                />
                <InputField
                  label="Allergies"
                  value={editData.allergies}
                  onChangeText={(text) => setEditData({ ...editData, allergies: text })}
                  placeholder="Enter any allergies"
                  multiline
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
                    style={styles.actionButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSaveChanges}
                    style={styles.actionButton}
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
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Upcoming Appointments</Text>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentType}>
                      {appointment.type === 'routine' ? '🩺' : '🔍'} {appointment.type.replace('-', ' ')}
                    </Text>
                    <Text style={styles.appointmentDate}>
                      {appointment.date} at {appointment.time}
                    </Text>
                    <Text style={styles.appointmentCode}>
                      Ticket: {appointment.ticketCode}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={commonStyles.textSecondary}>No upcoming appointments</Text>
            )}
          </View>

          {/* Health Recommendations */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Health Recommendations</Text>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>💧</Text>
              <Text style={styles.recommendationText}>
                Stay hydrated - aim for 8 glasses of water daily
              </Text>
            </View>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>🚶‍♂️</Text>
              <Text style={styles.recommendationText}>
                Take a 30-minute walk today for better cardiovascular health
              </Text>
            </View>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>😴</Text>
              <Text style={styles.recommendationText}>
                Maintain 7-9 hours of sleep for optimal recovery
              </Text>
            </View>
          </View>

          {/* Demo Actions */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Demo Actions</Text>
            <Button
              title="🔄 Switch to Random User"
              onPress={handleSwitchUser}
              variant="outline"
              style={styles.demoButton}
            />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={commonStyles.floatingButton}
          onPress={handleSwitchUser}
        >
          <IconSymbol name="person.2.fill" size={24} color={colors.card} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  healthCard: {
    marginBottom: 16,
  },
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
    color: colors.textSecondary,
    fontWeight: '500',
  },
  healthValue: {
    fontSize: 16,
    color: colors.text,
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
    backgroundColor: colors.background,
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
    color: colors.text,
    textTransform: 'capitalize',
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentCode: {
    fontSize: 12,
    color: colors.primary,
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
    color: colors.text,
    lineHeight: 20,
  },
  demoButton: {
    marginTop: 8,
  },
});
