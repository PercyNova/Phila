
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { OTPInput } from '../../components/OTPInput';
import { colors, commonStyles } from '../../../styles/commonStyles';
import { validateID, validateSurname, validatePhoneNumber, validateOTP } from '../../utils/validation';

export const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, verifyOTP, simulateFaceID, isLoading } = useAuth();
  
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [formData, setFormData] = useState({
    idPassport: '',
    surname: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.idPassport) {
      newErrors.idPassport = 'ID/Passport is required';
    } else if (!validateID(formData.idPassport)) {
      newErrors.idPassport = 'Please enter a valid ID/Passport';
    }

    if (!formData.surname) {
      newErrors.surname = 'Surname is required';
    } else if (!validateSurname(formData.surname)) {
      newErrors.surname = 'Please enter a valid surname';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await login(formData);
      
      if (response.success && response.requiresOTP) {
        setStep('otp');
      } else if (!response.success) {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleOTPVerification = async (otp: string) => {
    if (!validateOTP(otp)) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }

    setOtpError('');

    try {
      const response = await verifyOTP(otp);
      
      if (response.success) {
        console.log('Login successful, navigating to home');
        router.replace('/(tabs)/(home)/');
      } else {
        setOtpError(response.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('An unexpected error occurred. Please try again.');
    }
  };

  const handleFaceID = async () => {
    try {
      const response = await simulateFaceID();
      
      if (response.success) {
        console.log('FaceID successful, navigating to home');
        router.replace('/(tabs)/(home)/');
      } else {
        Alert.alert('FaceID Failed', response.message);
      }
    } catch (error) {
      console.error('FaceID error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const renderCredentialsStep = () => (
    <View style={styles.formContainer}>
      <Text style={commonStyles.title}>Welcome to HealthApp</Text>
      <Text style={[commonStyles.textSecondary, styles.subtitle]}>
        Please enter your details to continue
      </Text>

      <InputField
        label="ID/Passport Number"
        value={formData.idPassport}
        onChangeText={(text) => setFormData({ ...formData, idPassport: text })}
        error={errors.idPassport}
        placeholder="Enter your ID or Passport number"
        autoCapitalize="characters"
        required
      />

      <InputField
        label="Surname"
        value={formData.surname}
        onChangeText={(text) => setFormData({ ...formData, surname: text })}
        error={errors.surname}
        placeholder="Enter your surname"
        autoCapitalize="words"
        required
      />

      <InputField
        label="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        error={errors.phoneNumber}
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        required
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.button}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="🔒 Use FaceID"
          onPress={handleFaceID}
          variant="outline"
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.formContainer}>
      <Text style={commonStyles.title}>Verify Your Identity</Text>
      <Text style={[commonStyles.textSecondary, styles.subtitle]}>
        We&apos;ve sent a verification code to your phone
      </Text>

      <OTPInput
        onComplete={handleOTPVerification}
        error={otpError}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Back to Login"
          onPress={() => setStep('credentials')}
          variant="outline"
          style={styles.button}
        />
      </View>

      <Text style={styles.otpHint}>
        For demo purposes, use code: <Text style={styles.otpCode}>1234</Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 'credentials' ? renderCredentialsStep() : renderOTPStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary + '40',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  otpHint: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: colors.textSecondary,
  },
  otpCode: {
    fontWeight: '700',
    color: colors.primary,
  },
});
