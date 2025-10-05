import React from 'react';
import type { Appointment } from '../types/dashboard';

interface AppointmentsSectionProps {
  appointments: Appointment[];
  appointmentsLoading: boolean;
  onRefresh: () => void;
  onUpdateStatus: (appointment: Appointment) => void;
  currentAdmin?: any;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ 
  appointments, 
  appointmentsLoading, 
  onRefresh, 
  onUpdateStatus,
  currentAdmin 
}) => {
  // Filter appointments by admin's own gender - male admin sees male appointments, female admin sees female appointments
  let filteredAppointments = appointments;
  if (currentAdmin?.gender) {
    filteredAppointments = appointments.filter(apt => 
      apt.user?.gender === currentAdmin.gender
    );
  }

  const upcomingAppointments = filteredAppointments.filter(apt => {
    const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
    return apt.status === 'scheduled' && appointmentDateTime > new Date();
  }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed')
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>ניהול תורים</h2>
        <button 
          onClick={onRefresh} 
          className="refresh-btn"
          disabled={appointmentsLoading}
        >
          {appointmentsLoading ? 'טוען...' : 'רענן'}
        </button>
      </div>
      
      {appointmentsLoading ? (
        <div className="loading-state">
          <p>טוען תורים...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>לא נמצאו תורים</p>
        </div>
      ) : (
        <div className="appointments-container">
          {/* Upcoming Appointments */}
          <div className="appointments-section">
            <h3 className="section-title">תורים קרובים</h3>
            {upcomingAppointments.length === 0 ? (
              <div className="empty-subsection">
                <p>אין תורים קרובים</p>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="appointment-card upcoming">
                    <div className="appointment-header">
                      <div className="appointment-date">
                        <span className="date">{new Date(apt.date).toLocaleDateString('he-IL')}</span>
                        <span className="time">{apt.time}</span>
                      </div>
                      <span className="status-badge scheduled">מתוכנן</span>
                    </div>
                    <div className="appointment-details">
                      <p><strong>לקוח:</strong> {apt.user?.fullName || 'לא ידוע'}</p>
                      <p><strong>טלפון:</strong> {apt.user?.phone || 'לא ידוע'}</p>
                      {apt.notes && <p><strong>הערות:</strong> {apt.notes}</p>}
                    </div>
                    <div className="appointment-actions">
                      <button 
                        className="status-update-btn"
                        onClick={() => onUpdateStatus(apt)}
                      >
                        עדכן סטטוס
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Appointments */}
          <div className="appointments-section">
            <h3 className="section-title">תורים שהושלמו</h3>
            {completedAppointments.length === 0 ? (
              <div className="empty-subsection">
                <p>אין תורים שהושלמו</p>
              </div>
            ) : (
              <div className="appointments-list">
                {completedAppointments.map((apt) => (
                  <div key={apt._id} className="appointment-card completed">
                    <div className="appointment-header">
                      <div className="appointment-date">
                        <span className="date">{new Date(apt.date).toLocaleDateString('he-IL')}</span>
                        <span className="time">{apt.time}</span>
                      </div>
                      <span className="status-badge completed">הושלם</span>
                    </div>
                    <div className="appointment-details">
                      <p><strong>לקוח:</strong> {apt.user?.fullName || 'לא ידוע'}</p>
                      <p><strong>טלפון:</strong> {apt.user?.phone || 'לא ידוע'}</p>
                      {apt.measurements?.weight && <p><strong>משקל:</strong> {apt.measurements.weight} ק"ג</p>}
                      {apt.caloriesBurnt && <p><strong>קלוריות:</strong> {apt.caloriesBurnt}</p>}
                      {apt.sessionNotes && <p><strong>הערות:</strong> {apt.sessionNotes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
