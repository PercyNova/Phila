
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { colors, commonStyles } from '../../../styles/commonStyles';
import { triageService, SymptomInput, TriageResult } from '../../services/triageService';
import { IconSymbol } from '@/components/IconSymbol';

export const TriagePage: React.FC = () => {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState('5');
  const [currentDuration, setCurrentDuration] = useState('');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const commonSymptoms = triageService.getCommonSymptoms();

  const addSymptom = () => {
    if (!currentSymptom.trim()) {
      Alert.alert('Error', 'Please enter a symptom');
      return;
    }

    const severity = parseInt(currentSeverity);
    if (isNaN(severity) || severity < 1 || severity > 10) {
      Alert.alert('Error', 'Severity must be between 1 and 10');
      return;
    }

    const newSymptom: SymptomInput = {
      symptom: currentSymptom.trim(),
      severity,
      duration: currentDuration.trim() || '1 day',
    };

    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom('');
    setCurrentSeverity('5');
    setCurrentDuration('');
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const addCommonSymptom = (symptom: string) => {
    setCurrentSymptom(symptom);
  };

  const runTriage = async () => {
    if (symptoms.length === 0) {
      Alert.alert('Error', 'Please add at least one symptom');
      return;
    }

    setIsLoading(true);
    try {
      const result = await triageService.evaluateSymptoms(symptoms);
      setTriageResult(result);
    } catch (error) {
      console.error('Triage error:', error);
      Alert.alert('Error', 'Failed to evaluate symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return colors.error;
      case 'high': return colors.warning;
      case 'medium': return colors.secondary;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const handleBookAppointment = () => {
    router.push('/(tabs)/appointments');
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={commonStyles.title}>Symptom Triage</Text>
            <Text style={commonStyles.textSecondary}>
              Get personalized health recommendations
            </Text>
          </View>
        </View>

        {/* Symptom Input */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Add Your Symptoms</Text>
          
          <InputField
            label="Describe your symptom"
            value={currentSymptom}
            onChangeText={setCurrentSymptom}
            placeholder="e.g., headache, fever, cough"
          />
          
          <InputField
            label="Severity (1-10 scale)"
            value={currentSeverity}
            onChangeText={setCurrentSeverity}
            keyboardType="numeric"
            placeholder="5"
          />
          
          <InputField
            label="Duration (optional)"
            value={currentDuration}
            onChangeText={setCurrentDuration}
            placeholder="e.g., 2 hours, 3 days"
          />
          
          <Button
            title="Add Symptom"
            onPress={addSymptom}
            variant="outline"
            style={styles.addButton}
          />
        </View>

        {/* Common Symptoms */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Common Symptoms</Text>
          <Text style={styles.commonSymptomsNote}>
            Tap to quickly add a common symptom
          </Text>
          
          <View style={styles.commonSymptoms}>
            {commonSymptoms.slice(0, 12).map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={styles.commonSymptomButton}
                onPress={() => addCommonSymptom(symptom)}
              >
                <Text style={styles.commonSymptomText}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Added Symptoms */}
        {symptoms.length > 0 && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Your Symptoms</Text>
            
            {symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View style={styles.symptomInfo}>
                  <Text style={styles.symptomText}>{symptom.symptom}</Text>
                  <Text style={styles.symptomDetails}>
                    Severity: {symptom.severity}/10 • Duration: {symptom.duration}
                  </Text>
                  <Text style={styles.symptomSeverityLabel}>
                    {triageService.getSeverityDescription(symptom.severity)}
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
            
            <Button
              title="🔍 Evaluate Symptoms"
              onPress={runTriage}
              loading={isLoading}
              style={styles.evaluateButton}
            />
          </View>
        )}

        {/* Triage Result */}
        {triageResult && (
          <View style={[
            commonStyles.card,
            styles.triageResult,
            { borderColor: getSeverityColor(triageResult.severity) }
          ]}>
            <View style={styles.triageHeader}>
              <Text style={styles.triageTitle}>Assessment Result</Text>
              <Text style={[
                styles.triageSeverity,
                { color: getSeverityColor(triageResult.severity) }
              ]}>
                {triageResult.severity.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.triageContent}>
              <View style={styles.triageSection}>
                <Text style={styles.triageSectionTitle}>Urgency Level</Text>
                <Text style={styles.triageUrgency}>{triageResult.urgency}</Text>
              </View>
              
              <View style={styles.triageSection}>
                <Text style={styles.triageSectionTitle}>Recommendation</Text>
                <Text style={styles.triageRecommendation}>
                  {triageResult.recommendation}
                </Text>
              </View>
              
              <View style={styles.triageActions}>
                {triageResult.severity === 'critical' && (
                  <Button
                    title="🚨 Call Emergency Services"
                    onPress={() => router.push('/(tabs)/emergency')}
                    variant="emergency"
                    style={styles.emergencyButton}
                  />
                )}
                
                {(triageResult.severity === 'high' || triageResult.severity === 'medium') && (
                  <Button
                    title="📅 Book Appointment"
                    onPress={handleBookAppointment}
                    style={styles.appointmentButton}
                  />
                )}
                
                <Button
                  title="📋 Start New Assessment"
                  onPress={() => {
                    setSymptoms([]);
                    setTriageResult(null);
                  }}
                  variant="outline"
                  style={styles.newAssessmentButton}
                />
              </View>
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={[commonStyles.card, styles.disclaimer]}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This triage assessment is for informational purposes only and should not replace professional medical advice. 
            If you are experiencing a medical emergency, call 911 immediately.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  addButton: {
    marginTop: 8,
  },
  commonSymptomsNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  commonSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  commonSymptomButton: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
  },
  commonSymptomText: {
    fontSize: 14,
    color: colors.text,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    fontWeight: '600',
    marginBottom: 4,
  },
  symptomDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  symptomSeverityLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  evaluateButton: {
    marginTop: 16,
  },
  triageResult: {
    borderWidth: 2,
  },
  triageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  triageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  triageSeverity: {
    fontSize: 16,
    fontWeight: '700',
  },
  triageContent: {
    gap: 16,
  },
  triageSection: {
    marginBottom: 8,
  },
  triageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  triageUrgency: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  triageRecommendation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  triageActions: {
    gap: 12,
    marginTop: 8,
  },
  emergencyButton: {
    marginBottom: 8,
  },
  appointmentButton: {
    marginBottom: 8,
  },
  newAssessmentButton: {
    marginTop: 4,
  },
  disclaimer: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
    borderWidth: 1,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
