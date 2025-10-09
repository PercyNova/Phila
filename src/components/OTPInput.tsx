
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '../../styles/commonStyles';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  onComplete,
  error,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              activeIndex === index && styles.activeInput,
              error && styles.errorInput,
            ]}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            onFocus={() => setActiveIndex(index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.hint}>Enter the 4-digit code sent to your phone</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 8,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: colors.textSecondary + '40',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.card,
  },
  activeInput: {
    borderColor: colors.primary,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
