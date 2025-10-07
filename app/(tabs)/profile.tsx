
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    weight: '',
    allergies: '',
    bloodType: '',
    emergencyContact: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: getDecryptedData(user.email),
        phoneNumber: getDecryptedData(user.phoneNumber),
        weight: user.weight,
        allergies: user.allergies,
        bloodType: user.bloodType,
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
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    if (!validateWeight(formData.weight)) {
      Alert.alert('Error', 'Please enter a valid weight');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedUser = {
        ...user!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: encryptData(formData.email),
        phoneNumber: encryptData(formData.phoneNumber),
        weight: formData.weight,
        allergies: formData.allergies,
        bloodType: formData.bloodType,
        emergencyContact: encryptData(formData.emergencyContact),
      };

      updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
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
        phoneNumber: getDecryptedData(user.phoneNumber),
        weight: user.weight,
        allergies: user.allergies,
        bloodType: user.bloodType,
        emergencyContact: getDecryptedData(user.emergencyContact),
      });
    }
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

  const renderField = (label: string, value: string, key: keyof typeof formData) => {
    return (
      <InputField
        label={label}
        value={value}
        onChangeText={(text) => setFormData({ ...formData, [key]: text })}
        editable={isEditing}
        placeholder={`Enter ${label.toLowerCase()}`}
        keyboardType={key === 'phoneNumber' ? 'phone-pad' : key === 'weight' ? 'numeric' : 'default'}
        multiline={key === 'allergies'}
      />
    );
  };

  return (
    <AppNavigator>
      <SafeAreaView style={commonStyles.wrapper}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={commonStyles.scrollViewWithTabBar}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={commonStyles.title}>Profile</Text>
            <Text style={commonStyles.textSecondary}>
              Manage your personal information
            </Text>
          </View>

          <View style={commonStyles.card}>
            <View style={styles.cardHeader}>
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
            {renderField('Email', formData.email, 'email')}
            {renderField('Phone Number', formData.phoneNumber, 'phoneNumber')}
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Health Information</Text>
            {renderField('Weight (kg)', formData.weight, 'weight')}
            {renderField('Blood Type', formData.bloodType, 'bloodType')}
            {renderField('Allergies', formData.allergies, 'allergies')}
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Emergency Contact</Text>
            {renderField('Emergency Contact', formData.emergencyContact, 'emergencyContact')}
          </View>

          {isEditing && (
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
                disabled={isLoading}
                style={styles.actionButton}
              />
            </View>
          )}

          {!isEditing && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Account Actions</Text>
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                style={[styles.logoutButton, { borderColor: colors.error }]}
              />
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
