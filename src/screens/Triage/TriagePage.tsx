import React, { useState } from "react";
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, 
  StyleSheet, Alert, useWindowDimensions 
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";

export default function TriagePageRedesign() {
  const [heartRate, setHeartRate] = useState("");
  const [respRate, setRespRate] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [temperature, setTemperature] = useState("");
  const [avpu, setAvpu] = useState("Alert");
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState("");

  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024; // Desktop breakpoint

  const handleSuggest = () => {
    const hr = parseInt(heartRate);
    const rr = parseInt(respRate);
    const bp = parseInt(bpSystolic);
    const temp = parseFloat(temperature);

    if (hr > 130 || rr > 30 || bp > 200 || temp > 40) {
      setPrediction("Red");
    } else if (hr > 110 || rr > 20 || bp > 160 || temp > 38) {
      setPrediction("Orange");
    } else if (hr > 100 || rr > 16 || bp > 140 || temp > 37) {
      setPrediction("Yellow");
    } else {
      setPrediction("Green");
    }
  };

  const handleClear = () => {
    setHeartRate("");
    setRespRate("");
    setBpSystolic("");
    setTemperature("");
    setAvpu("Alert");
    setSymptoms("");
    setPrediction("");
  };

  const handleRandom = () => {
    setHeartRate(String(Math.floor(Math.random() * (150 - 50 + 1)) + 50));
    setRespRate(String(Math.floor(Math.random() * (40 - 10 + 1)) + 10));
    setBpSystolic(String(Math.floor(Math.random() * (220 - 80 + 1)) + 80));
    setTemperature(String((Math.random() * (41 - 35)) + 35).substring(0, 4));
    setAvpu("Alert");
    setSymptoms("headache, fever");
  };

  const handleSummary = () => {
    Alert.alert(
      "Patient Summary",
      `Heart Rate: ${heartRate} bpm\nRespiratory Rate: ${respRate} breaths/min\nSystolic BP: ${bpSystolic} mmHg\nTemperature: ${temperature}°C\nAVPU: ${avpu}\nSymptoms: ${symptoms}\n\nPredicted SATS Category: ${prediction || "Not calculated"}`,
      [{ text: "OK" }]
    );
  };

  const getResultBgColor = () => {
    switch (prediction) {
      case "Red": return "#EF4444";
      case "Orange": return "#F97316";
      case "Yellow": return "#FBBF24";
      case "Green": return "#10B981";
      default: return "#E5E7EB";
    }
  };

  const QuickReference = () => (
    <View style={[styles.guideCard, isDesktop && styles.guideCardDesktop]}>
      <View style={styles.guideHeader}>
        <IconSymbol name="info.circle" size={14} color={'#1F2937'} />
        <Text style={styles.guideHeaderText}>Quick Reference</Text>
      </View>

      <ScrollView style={styles.guideBody}>
        {/* Heart Rate */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• Heart Rate</Text>
          <Text style={styles.guideNormal}>Normal: 60-100 bpm</Text>
          <Text style={styles.guideText}>• Place two fingers on wrist pulse</Text>
          <Text style={styles.guideText}>• Count beats for 60 seconds</Text>
          <Text style={styles.guideText}>• Or count for 30s and multiply by 2</Text>
        </View>

        {/* Respiratory Rate */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• Respiratory Rate</Text>
          <Text style={styles.guideNormal}>Normal: 12-20 breaths/min</Text>
          <Text style={styles.guideText}>• Watch chest rise and fall</Text>
          <Text style={styles.guideText}>• Count breaths for 60 seconds</Text>
          <Text style={styles.guideText}>• One breath = inhale + exhale</Text>
        </View>

        {/* Blood Pressure */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• Blood Pressure</Text>
          <Text style={styles.guideNormal}>Normal: 90-120 mmHg (systolic)</Text>
          <Text style={styles.guideText}>• Use BP cuff on upper arm</Text>
          <Text style={styles.guideText}>• Patient should be seated, relaxed</Text>
          <Text style={styles.guideText}>• Record systolic (first number)</Text>
        </View>

        {/* Temperature */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• Temperature</Text>
          <Text style={styles.guideNormal}>Normal: 36.5-37.5°C</Text>
          <Text style={styles.guideText}>• Use digital thermometer</Text>
          <Text style={styles.guideText}>• Oral, ear, or forehead reading</Text>
          <Text style={styles.guideText}>• Wait 30min after hot/cold drinks</Text>
        </View>

        {/* AVPU Scale */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• AVPU Scale</Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideBold}>Alert:</Text> Awake, oriented
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideBold}>Voice:</Text> Responds to voice
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideBold}>Pain:</Text> Responds only to pain
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.guideBold}>Unresponsive:</Text> No response
          </Text>
        </View>

        {/* SATS Categories */}
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>• SATS Categories</Text>

          <View style={styles.categoryRow}>
            <View style={[styles.colorBox, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.guideText}>
              <Text style={styles.guideBold}>Red:</Text> Emergency (immediate)
            </Text>
          </View>

          <View style={styles.categoryRow}>
            <View style={[styles.colorBox, { backgroundColor: '#F97316' }]} />
            <Text style={styles.guideText}>
              <Text style={styles.guideBold}>Orange:</Text> Very urgent {'<10min'}
            </Text>
          </View>

          <View style={styles.categoryRow}>
            <View style={[styles.colorBox, { backgroundColor: '#FBBF24' }]} />
            <Text style={styles.guideText}>
              <Text style={styles.guideBold}>Yellow:</Text> Urgent {'<1hr'}
            </Text>
          </View>

          <View style={styles.categoryRow}>
            <View style={[styles.colorBox, { backgroundColor: '#10B981' }]} />
            <Text style={styles.guideText}>
              <Text style={styles.guideBold}>Green:</Text> Routine {'<4hr'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

return (
  // ✅ Added contentContainerStyle for bottom margin
  <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
    {/* Header */}
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.iconContainer}>
          <IconSymbol name="doc.text" size={20} color={'#1F2937'} />
        </View>
        <View>
          <Text style={styles.headerTitle}>SATS Triage</Text>
          <Text style={styles.headerSubtitle}>Patient Assessment System</Text>
        </View>
      </View>
    </View>

    {/* Main Content */}
    <View style={[styles.mainContent, isDesktop && styles.mainContentDesktop]}>
      <View style={isDesktop ? styles.desktopLayout : styles.mobileLayout}>
        {/* Left Side - Form */}
        <View style={isDesktop ? styles.leftColumn : styles.fullWidth}>
          {/* Input Form */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Patient Vital Signs</Text>
            </View>
            <View style={styles.formBody}>
              {/* Heart Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Heart Rate (bpm)</Text>
                <TextInput
                  style={styles.input}
                  value={heartRate}
                  onChangeText={setHeartRate}
                  placeholder="60-100"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Respiratory Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Respiratory Rate (breaths/min)</Text>
                <TextInput
                  style={styles.input}
                  value={respRate}
                  onChangeText={setRespRate}
                  placeholder="12-20"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Systolic BP */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Systolic BP (mmHg)</Text>
                <TextInput
                  style={styles.input}
                  value={bpSystolic}
                  onChangeText={setBpSystolic}
                  placeholder="90-120"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Temperature */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Temperature (°C)</Text>
                <TextInput
                  style={styles.input}
                  value={temperature}
                  onChangeText={setTemperature}
                  placeholder="36.5-37.5"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* AVPU */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>AVPU Scale</Text>
                <TextInput
                  style={styles.input}
                  value={avpu}
                  onChangeText={setAvpu}
                  placeholder="Alert/Voice/Pain/Unresponsive"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Symptoms */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Symptoms (comma-separated)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={symptoms}
                  onChangeText={setSymptoms}
                  placeholder="headache, fever, nausea..."
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* SATS Color Codes (Mobile/Tablet ONLY) */}
          {!isDesktop && (
            <View style={[styles.infoCard, { marginBottom: 16 }]}>
              <View style={styles.infoContent}>
                <IconSymbol name="info.circle" size={20} color={'#065F46'} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>SATS Color Codes</Text>
                  <Text style={styles.infoDescription}>
                    <Text style={{ color: '#DC2626', fontWeight: '600' }}>Red</Text> = Emergency ·
                    <Text style={{ color: '#EA580C', fontWeight: '600' }}> Orange</Text> = Very Urgent ·
                    <Text style={{ color: '#CA8A04', fontWeight: '600' }}> Yellow</Text> = Urgent ·
                    <Text style={{ color: '#059669', fontWeight: '600' }}> Green</Text> = Routine
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, styles.buttonFullWidth]}
              onPress={handleSuggest}
              disabled={!heartRate || !respRate || !bpSystolic || !temperature}
            >
              <Text style={styles.primaryButtonText}>Predict</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSuggest}>
              <Text style={styles.secondaryButtonText}>Suggest</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleClear}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRandom}>
              <Text style={styles.secondaryButtonText}>Random</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSummary}>
              <Text style={styles.secondaryButtonText}>Summary</Text>
            </TouchableOpacity>
          </View>

          {/* Prediction Result */}
          {prediction && (
            <View style={[styles.resultCard, { backgroundColor: getResultBgColor() }]}>
              <View style={styles.resultContent}>
                <View style={styles.resultIcon}>
                  <IconSymbol name="checkmark" size={24} color={'#FFFFFF'} />
                </View>
                <View>
                  <Text style={styles.resultLabel}>Predicted SATS Category</Text>
                  <Text style={styles.resultValue}>{prediction}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Right Side - Quick Reference (Desktop only) */}
        {isDesktop && (
          <View style={styles.rightColumn}>
            <QuickReference />
            <View style={styles.infoCard}>
              <View style={styles.infoContent}>
                <IconSymbol name="info.circle" size={20} color={'#065F46'} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>SATS Color Codes</Text>
                  <Text style={styles.infoDescription}>
                    <Text style={{ color: '#DC2626', fontWeight: '600' }}>Red</Text> = Emergency ·
                    <Text style={{ color: '#EA580C', fontWeight: '600' }}> Orange</Text> = Very Urgent ·
                    <Text style={{ color: '#CA8A04', fontWeight: '600' }}> Yellow</Text> = Urgent ·
                    <Text style={{ color: '#059669', fontWeight: '600' }}> Green</Text> = Routine
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Quick Reference for Mobile/Tablet */}
      {!isDesktop && <QuickReference />}
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  // ✅ added this for bottom margin
  scrollContentContainer: {
    paddingBottom: 80, // gives bottom space to entire page
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  mainContent: { padding: 16 },
  mainContentDesktop: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  desktopLayout: { flexDirection: 'row', gap: 24 },
  mobileLayout: { flexDirection: 'column' },
  leftColumn: { flex: 2 },
  rightColumn: { flex: 1 },
  fullWidth: { flex: 1 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  formHeader: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  formHeaderText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  formBody: { padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFullWidth: { minWidth: '100%' },
  primaryButton: {
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIconText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  resultLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '500', opacity: 0.9 },
  resultValue: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    overflow: 'hidden',
    marginBottom: 16,
  },
  guideCardDesktop: { height: 'auto', maxHeight: 800 },
  guideHeader: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  guideHeaderText: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  guideBody: { padding: 16, maxHeight: 700 },
  guideSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guideSectionTitle: { fontSize: 13, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  guideNormal: { fontSize: 11, color: '#6B7280', marginBottom: 8 },
  guideText: { fontSize: 11, color: '#6B7280', marginBottom: 4 },
  guideBold: { fontWeight: '600' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  colorBox: { width: 12, height: 12, borderRadius: 3 },
  infoCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 16,
  },
  infoContent: { flexDirection: 'row', gap: 12 },
  infoIcon: { fontSize: 20 },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#065F46', marginBottom: 4 },
  infoDescription: { fontSize: 11, color: '#047857' },
});
