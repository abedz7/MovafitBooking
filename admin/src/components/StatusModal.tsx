import React from 'react';
import { Appointment, Measurements } from '../types/dashboard';

interface StatusModalProps {
  modalOpen: boolean;
  selectedAppointment: Appointment | null;
  newStatus: 'completed' | 'cancelled';
  measurements: Measurements;
  updating: boolean;
  onClose: () => void;
  onStatusChange: (status: 'completed' | 'cancelled') => void;
  onMeasurementsChange: (measurements: Measurements) => void;
  onSave: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  modalOpen,
  selectedAppointment,
  newStatus,
  measurements,
  updating,
  onClose,
  onStatusChange,
  onMeasurementsChange,
  onSave
}) => {
  if (!modalOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>עדכון סטטוס תור</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {selectedAppointment && (
            <div className="appointment-info">
              <p><strong>תאריך:</strong> {new Date(selectedAppointment.date).toLocaleDateString('he-IL')}</p>
              <p><strong>שעה:</strong> {selectedAppointment.time}</p>
              <p><strong>לקוח:</strong> {selectedAppointment.user?.fullName}</p>
            </div>
          )}

          <div className="status-selection">
            <label>
              <input
                type="radio"
                value="completed"
                checked={newStatus === 'completed'}
                onChange={(e) => onStatusChange(e.target.value as 'completed')}
              />
              הושלם
            </label>
            <label>
              <input
                type="radio"
                value="cancelled"
                checked={newStatus === 'cancelled'}
                onChange={(e) => onStatusChange(e.target.value as 'cancelled')}
              />
              בוטל
            </label>
          </div>

          {newStatus === 'completed' && (
            <div className="measurements-section">
              <h4>מדידות ותוצאות</h4>
              <div className="measurements-grid">
                <div className="measurement-field">
                  <label>משקל (ק"ג)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.weight}
                    onChange={(e) => onMeasurementsChange({...measurements, weight: e.target.value})}
                    placeholder="הזן משקל"
                  />
                </div>
                <div className="measurement-field">
                  <label>חזה (ס"מ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.chest}
                    onChange={(e) => onMeasurementsChange({...measurements, chest: e.target.value})}
                    placeholder="הזן מדידת חזה"
                  />
                </div>
                <div className="measurement-field">
                  <label>מותן (ס"מ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.waist}
                    onChange={(e) => onMeasurementsChange({...measurements, waist: e.target.value})}
                    placeholder="הזן מדידת מותן"
                  />
                </div>
                <div className="measurement-field">
                  <label>ירכיים (ס"מ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.hips}
                    onChange={(e) => onMeasurementsChange({...measurements, hips: e.target.value})}
                    placeholder="הזן מדידת ירכיים"
                  />
                </div>
                <div className="measurement-field">
                  <label>קלוריות שנשרפו</label>
                  <input
                    type="number"
                    step="1"
                    value={measurements.caloriesBurnt}
                    onChange={(e) => onMeasurementsChange({...measurements, caloriesBurnt: e.target.value})}
                    placeholder="הזן מספר קלוריות"
                  />
                </div>
              </div>
              <div className="notes-field">
                <label>הערות על המפגש</label>
                <textarea
                  value={measurements.notes}
                  onChange={(e) => onMeasurementsChange({...measurements, notes: e.target.value})}
                  placeholder="הזן הערות על המפגש..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            ביטול
          </button>
          <button 
            className="btn-save" 
            onClick={onSave}
            disabled={updating}
          >
            {updating ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  );
};
