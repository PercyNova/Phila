
export interface TriageResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  urgency: string;
  symptoms: string[];
}

export interface SymptomInput {
  symptom: string;
  severity: number; // 1-10 scale
  duration: string; // e.g., "2 hours", "3 days"
}

class TriageService {
  private criticalSymptoms = [
    'chest pain',
    'difficulty breathing',
    'severe bleeding',
    'loss of consciousness',
    'severe head injury',
    'stroke symptoms',
    'heart attack',
    'severe allergic reaction',
    'poisoning',
    'severe burns'
  ];

  private highPrioritySymptoms = [
    'severe pain',
    'high fever',
    'vomiting blood',
    'severe abdominal pain',
    'broken bone',
    'deep cut',
    'severe headache',
    'vision problems',
    'severe dizziness'
  ];

  private mediumPrioritySymptoms = [
    'moderate pain',
    'fever',
    'persistent cough',
    'nausea',
    'mild headache',
    'rash',
    'minor cut',
    'sprain',
    'cold symptoms'
  ];

  async evaluateSymptoms(symptoms: SymptomInput[]): Promise<TriageResult> {
    console.log('Evaluating symptoms:', symptoms);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let recommendation = '';
    let urgency = '';
    
    const symptomTexts = symptoms.map(s => s.symptom.toLowerCase());
    
    // Check for critical symptoms
    const hasCritical = symptomTexts.some(symptom => 
      this.criticalSymptoms.some(critical => symptom.includes(critical))
    );
    
    if (hasCritical) {
      maxSeverity = 'critical';
      recommendation = 'Seek immediate emergency care. Call 911 or go to the nearest emergency room immediately.';
      urgency = 'IMMEDIATE - Call 911 now';
    } else {
      // Check for high priority symptoms
      const hasHigh = symptomTexts.some(symptom => 
        this.highPrioritySymptoms.some(high => symptom.includes(high))
      );
      
      if (hasHigh) {
        maxSeverity = 'high';
        recommendation = 'Seek urgent medical attention within 2-4 hours. Visit urgent care or emergency room.';
        urgency = 'URGENT - Seek care within 2-4 hours';
      } else {
        // Check for medium priority symptoms
        const hasMedium = symptomTexts.some(symptom => 
          this.mediumPrioritySymptoms.some(medium => symptom.includes(medium))
        );
        
        if (hasMedium) {
          maxSeverity = 'medium';
          recommendation = 'Schedule an appointment with your healthcare provider within 24-48 hours.';
          urgency = 'Schedule appointment within 1-2 days';
        } else {
          maxSeverity = 'low';
          recommendation = 'Monitor symptoms. Consider scheduling a routine appointment if symptoms persist.';
          urgency = 'Monitor and schedule routine appointment if needed';
        }
      }
    }
    
    // Consider severity scores
    const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
    
    if (avgSeverity >= 8 && maxSeverity !== 'critical') {
      maxSeverity = maxSeverity === 'low' ? 'medium' : 'high';
    }
    
    const result: TriageResult = {
      severity: maxSeverity,
      recommendation,
      urgency,
      symptoms: symptomTexts,
    };
    
    console.log('Triage result:', result);
    
    return result;
  }

  getCommonSymptoms(): string[] {
    return [
      'Headache',
      'Fever',
      'Cough',
      'Sore throat',
      'Nausea',
      'Abdominal pain',
      'Back pain',
      'Fatigue',
      'Dizziness',
      'Chest pain',
      'Shortness of breath',
      'Rash',
      'Joint pain',
      'Muscle pain',
      'Vomiting',
      'Diarrhea',
      'Constipation',
      'Insomnia',
      'Anxiety',
      'Depression'
    ];
  }

  getSeverityDescription(severity: number): string {
    if (severity <= 2) return 'Mild';
    if (severity <= 4) return 'Mild to Moderate';
    if (severity <= 6) return 'Moderate';
    if (severity <= 8) return 'Moderate to Severe';
    return 'Severe';
  }
}

export const triageService = new TriageService();
