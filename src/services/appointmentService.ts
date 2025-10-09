
export interface Appointment {
  id: string;
  type: 'routine' | 'symptom-based' | 'emergency';
  date: string;
  time: string;
  symptoms?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  ticketCode: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

class AppointmentService {
  private appointments: Appointment[] = [];

  async bookAppointment(
    type: 'routine' | 'symptom-based',
    date: string,
    time: string,
    symptoms?: string[]
  ): Promise<{ success: boolean; appointment?: Appointment; message: string }> {
    console.log('Booking appointment:', { type, date, time, symptoms });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      date,
      time,
      symptoms,
      ticketCode: this.generateTicketCode(),
      status: 'scheduled',
    };
    
    this.appointments.push(appointment);
    
    console.log('Appointment booked successfully:', appointment);
    
    return {
      success: true,
      appointment,
      message: 'Appointment booked successfully',
    };
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    console.log('Fetching upcoming appointments');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = new Date();
    const upcoming = this.appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && apt.status === 'scheduled';
    });
    
    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getAllAppointments(): Promise<Appointment[]> {
    console.log('Fetching all appointments');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...this.appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async cancelAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
    console.log('Cancelling appointment:', appointmentId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appointment = this.appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
      return {
        success: false,
        message: 'Appointment not found',
      };
    }
    
    appointment.status = 'cancelled';
    
    return {
      success: true,
      message: 'Appointment cancelled successfully',
    };
  }

  private generateTicketCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate some mock upcoming appointments for demo
  generateMockAppointments(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    this.appointments = [
      {
        id: '1',
        type: 'routine',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        ticketCode: 'ABC12345',
        status: 'scheduled',
        notes: 'Annual checkup',
      },
      {
        id: '2',
        type: 'symptom-based',
        date: nextWeek.toISOString().split('T')[0],
        time: '14:30',
        symptoms: ['headache', 'fatigue'],
        severity: 'medium',
        ticketCode: 'DEF67890',
        status: 'scheduled',
      },
    ];
  }
}

export const appointmentService = new AppointmentService();
