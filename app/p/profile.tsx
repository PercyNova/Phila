import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { Button } from '@/src/components/Button';
import { InputField } from '@/src/components/InputField';
import { commonStyles } from '@/styles/commonStyles';
import { decryptData, encryptData } from '@/src/utils/encryption';
import { validateEmail, validatePhoneNumber, validateWeight } from '@/src/utils/validation';
import { IconSymbol } from '@/components/IconSymbol';

const NATURE_COLORS = {
  primary: '#8BAF9E',
  primaryDark: '#6B9680',
  background: '#F5F9F7',
  card: '#FFFFFF',
  light: '#E8F3ED',
  text: '#2D3A31',
  textSecondary: '#6B7E72',
  textTertiary: '#9AA8A0',
  highlight: '#D9E6DD',
  error: '#FF7043',
  success: '#4CAF50',
  border: '#E0E8E4',
};

const GRID_BREAKPOINT = 768;

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    weight: '',
    allergies: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window: { width } }: { window: { width: number } }) => setScreenWidth(width);
    const subscription = Dimensions.addEventListener('change', onChange);

    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: getDecrypted(user.email),
        phoneNumber: getDecrypted(user.phoneNumber),
        weight: user.weight,
        allergies: user.allergies,
        bloodType: user.bloodType,
        emergencyContact: getDecrypted(user.emergencyContact),
      });
    }

    return () => subscription.remove();
  }, [user]);

  const isGridActive = screenWidth >= GRID_BREAKPOINT;

  const getDecrypted = (data: string) => {
    try {
      return decryptData(data);
    } catch {
      return data;
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
      Alert.alert('Error', 'Enter a valid email');
      return false;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Enter a valid phone number');
      return false;
    }
    if (!validateWeight(formData.weight)) {
      Alert.alert('Error', 'Enter a valid weight');
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
      console.error(error);
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
        email: getDecrypted(user.email),
        phoneNumber: getDecrypted(user.phoneNumber),
        weight: user.weight,
        allergies: user.allergies,
        bloodType: user.bloodType,
        emergencyContact: getDecrypted(user.emergencyContact),
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const renderField = (label: string, keyName: keyof typeof formData, span: 1 | 2 | 3, icon?: string) => {
    let width = '100%';
    if (isGridActive) {
      if (span === 2) width = 'calc(50% - 8px)';
      if (span === 3) width = 'calc(33.333% - 11px)';
    }

    return (
      <View style={[styles.fieldContainer, { width }]} key={keyName}>
        <View style={styles.labelRow}>
          {icon && <IconSymbol name={icon} size={16} color={NATURE_COLORS.textSecondary} />}
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <InputField
          value={formData[keyName]}
          onChangeText={(text) => setFormData({ ...formData, [keyName]: text })}
          editable={isEditing}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType={keyName === 'phoneNumber' ? 'phone-pad' : keyName === 'weight' ? 'numeric' : 'default'}
          multiline={keyName === 'allergies'}
          inputStyle={[
            styles.input,
            !isEditing && styles.inputDisabled,
            keyName === 'allergies' && styles.multilineInput
          ]}
        />
      </View>
    );
  };

  return (
    <AppNavigator>
      <SafeAreaView style={[commonStyles.wrapper, { backgroundColor: NATURE_COLORS.background }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[commonStyles.scrollViewWithTabBar, styles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Avatar */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {formData.firstName?.[0]?.toUpperCase() || 'U'}
                    {formData.lastName?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                {isEditing && (
                  <TouchableOpacity style={styles.avatarEditButton}>
                    <IconSymbol name="camera" size={16} color={NATURE_COLORS.card} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>
                  {formData.firstName} {formData.lastName}
                </Text>
                <Text style={styles.headerSubtitle}>{formData.email}</Text>
              </View>
            </View>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerEditButton}>
                <IconSymbol name="pencil" size={20} color={NATURE_COLORS.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={isGridActive ? styles.gridContainer : styles.stackContainer}>
            {/* Personal Information Card */}
            <View style={[styles.card, isGridActive && styles.gridCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconBadge}>
                    <IconSymbol name="person" size={18} color={NATURE_COLORS.primary} />
                  </View>
                  <Text style={styles.cardTitle}>Personal Information</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.fieldsRow}>
                  {renderField('First Name', 'firstName', 2, 'person')}
                  {renderField('Last Name', 'lastName', 2, 'person')}
                </View>
                <View style={styles.fieldsRow}>
                  {renderField('Email Address', 'email', 2, 'envelope')}
                  {renderField('Phone Number', 'phoneNumber', 2, 'phone')}
                </View>
              </View>
            </View>

            {/* Health Information Card */}
            <View style={[styles.card, isGridActive && styles.gridCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.iconBadge, styles.iconBadgeHealth]}>
                    <IconSymbol name="heart" size={18} color={NATURE_COLORS.error} />
                  </View>
                  <Text style={styles.cardTitle}>Health Information</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.fieldsRow}>
                  {renderField('Weight (kg)', 'weight', 3, 'scale')}
                  {renderField('Blood Type', 'bloodType', 3, 'drop')}
                  {renderField('Emergency Contact', 'emergencyContact', 3, 'phone.badge')}
                </View>
                <View style={styles.fieldsRow}>
                  {renderField('Allergies', 'allergies', 1, 'exclamationmark.triangle')}
                </View>
              </View>
            </View>

            {/* Account Actions Card */}
            {!isEditing && (
              <View style={[styles.card, styles.accountCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={[styles.iconBadge, styles.iconBadgeWarning]}>
                      <IconSymbol name="gear" size={18} color={NATURE_COLORS.textSecondary} />
                    </View>
                    <Text style={styles.cardTitle}>Account Settings</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <TouchableOpacity style={styles.actionItem}>
                    <View style={styles.actionItemLeft}>
                      <IconSymbol name="lock" size={20} color={NATURE_COLORS.textSecondary} />
                      <Text style={styles.actionItemText}>Change Password</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color={NATURE_COLORS.textTertiary} />
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
                    <View style={styles.actionItemLeft}>
                      <IconSymbol name="arrow.right.square" size={20} color={NATURE_COLORS.error} />
                      <Text style={[styles.actionItemText, styles.logoutText]}>Logout</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color={NATURE_COLORS.textTertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Floating Action Buttons for Editing */}
          {isEditing && (
            <View style={styles.floatingActions}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                style={styles.cancelButton}
                titleStyle={styles.cancelButtonText}
              />
              <Button
                title={isLoading ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                disabled={isLoading}
                style={styles.saveButton}
                titleStyle={styles.saveButtonText}
              />
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color={NATURE_COLORS.primary} />
                <Text style={styles.loadingText}>Updating profile...</Text>
              </View>
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 124,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: NATURE_COLORS.border,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: NATURE_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: NATURE_COLORS.card,
    shadowColor: NATURE_COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: NATURE_COLORS.card,
    letterSpacing: 1,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NATURE_COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NATURE_COLORS.card,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: NATURE_COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: NATURE_COLORS.textSecondary,
  },
  headerEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NATURE_COLORS.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: NATURE_COLORS.primary,
  },
  stackContainer: {
    gap: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    backgroundColor: NATURE_COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: NATURE_COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: NATURE_COLORS.border,
  },
  gridCard: {
    flex: 1,
    minWidth: 'calc(50% - 8px)',
  },
  accountCard: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: NATURE_COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBadgeHealth: {
    backgroundColor: '#FFEBEE',
  },
  iconBadgeWarning: {
    backgroundColor: '#F5F5F5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NATURE_COLORS.text,
  },
  cardContent: {
    gap: 16,
  },
  fieldsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  fieldContainer: {
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: NATURE_COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: NATURE_COLORS.background,
    borderWidth: 1,
    borderColor: NATURE_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: NATURE_COLORS.text,
  },
  inputDisabled: {
    backgroundColor: NATURE_COLORS.card,
    color: NATURE_COLORS.textSecondary,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: NATURE_COLORS.text,
  },
  logoutText: {
    color: NATURE_COLORS.error,
  },
  divider: {
    height: 1,
    backgroundColor: NATURE_COLORS.border,
  },
  floatingActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: NATURE_COLORS.border,
  },
  cancelButton: {
    flex: 1,
    borderColor: NATURE_COLORS.border,
    borderWidth: 2,
    backgroundColor: NATURE_COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: NATURE_COLORS.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: NATURE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: NATURE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: NATURE_COLORS.card,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: NATURE_COLORS.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: NATURE_COLORS.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: NATURE_COLORS.text,
  },
});