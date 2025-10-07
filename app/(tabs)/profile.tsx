import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { colors, commonStyles } from '@/styles/commonStyles';
import { decryptData, encryptData } from '@/src/utils/encryption';
import { validateEmail, validatePhoneNumber, validateWeight } from '@/src/utils/validation';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    weight: '',
    height: '',
    bloodType: '',
    allergies: '',
    emergencyContact: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Decrypt sensitive data for display
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: getDecryptedData(user.email),
        phone: getDecryptedData(user.phone),
        dateOfBirth: getDecryptedData(user.dateOfBirth),
        weight: user.weight,
        height: user.height,
        bloodType: user.bloodType,
        allergies: user.allergies,
        emergencyContact: getDecryptedData(user.emergencyContact),
      });
    }
  }, [user]);

  const getDecryptedData = (encryptedData: string): string => {
    try {
      return decryptData(encryptedData);
    } catch {
      return encryptedData;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.weight && !validateWeight(formData.weight)) {
      newErrors.weight = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: encryptData(formData.email),
          phone: encryptData(formData.phone),
          dateOfBirth: encryptData(formData.dateOfBirth),
          weight: formData.weight,
          height: formData.height,
          bloodType: formData.bloodType,
          allergies: formData.allergies,
          emergencyContact: encryptData(formData.emergencyContact),
        };

        updateUser(updatedUser);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: getDecryptedData(user.email),
        phone: getDecryptedData(user.phone),
        dateOfBirth: getDecryptedData(user.dateOfBirth),
        weight: user.weight,
        height: user.height,
        bloodType: user.bloodType,
        allergies: user.allergies,
        emergencyContact: getDecryptedData(user.emergencyContact),
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const renderField = (
    label: string,
    value: string,
    key: keyof typeof formData,
    options?: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
      multiline?: boolean;
      editable?: boolean;
    }
  ) => {
    const { keyboardType = 'default', multiline = false, editable = true } = options || {};

    if (isEditing && editable) {
      return (
        <InputField
          label={label}
          value={value}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          error={errors[key]}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      </View>
    );
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Profile</Text>
            <Text style={commonStyles.textSecondary}>
              Manage your personal information
            </Text>
          </View>

          {/* Personal Information */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.subtitle}>Personal Information</Text>
              {!isEditing && (
                <Button
                  title="Edit"
                  onPress={() => setIsEditing(true)}
                  variant="outline"
                  style={styles.editButton}
                />
              )}
            </View>

            {renderField('First Name', formData.firstName, 'firstName')}
            {renderField('Last Name', formData.lastName, 'lastName')}
            {renderField('Email', formData.email, 'email', { keyboardType: 'email-address' })}
            {renderField('Phone', formData.phone, 'phone', { keyboardType: 'phone-pad' })}
            {renderField('Date of Birth', formData.dateOfBirth, 'dateOfBirth', { editable: false })}
          </View>

          {/* Health Information */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Health Information</Text>
            
            {renderField('Weight (kg)', formData.weight, 'weight', { keyboardType: 'numeric' })}
            {renderField('Height (cm)', formData.height, 'height', { keyboardType: 'numeric' })}
            {renderField('Blood Type', formData.bloodType, 'bloodType', { editable: false })}
            {renderField('Allergies', formData.allergies, 'allergies', { multiline: true })}
          </View>

          {/* Emergency Contact */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Emergency Contact</Text>
            {renderField('Emergency Contact', formData.emergencyContact, 'emergencyContact')}
          </View>

          {/* Medical History */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Medical History</Text>
            {user?.medicalHistory && user.medicalHistory.length > 0 ? (
              user.medicalHistory.map((condition, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    • {getDecryptedData(condition)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={commonStyles.textSecondary}>No medical history recorded</Text>
            )}
          </View>

          {/* Current Medications */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Current Medications</Text>
            {user?.medications && user.medications.length > 0 ? (
              user.medications.map((medication, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    • {getDecryptedData(medication)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={commonStyles.textSecondary}>No medications recorded</Text>
            )}
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View style={styles.actionButtons}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title={isLoading ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                loading={isLoading}
                style={styles.actionButton}
              />
            </View>
          ) : (
            <View style={commonStyles.card}>
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                style={styles.logoutButton}
              />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.textSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary + '20',
  },
  historyItem: {
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
