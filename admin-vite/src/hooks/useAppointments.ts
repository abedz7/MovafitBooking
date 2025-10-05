import { useState } from 'react';
import type { Appointment, User } from '../types/dashboard';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  const fetchAppointments = async (forceRefresh = false, lastFetchTime = { appointments: 0 }, users: User[] = []) => {
    // Cache for 60 seconds
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.appointments < 60000) {
      return;
    }

    try {
      setAppointmentsLoading(true);
      
      // Fetch appointments
      const appointmentsResponse = await fetch('https://movafit-booking-server.vercel.app/api/appointments/getAllAppointments');
      const appointmentsData = await appointmentsResponse.json();
      const appointmentsList = appointmentsData.appointments || [];

      // Use cached users if available, otherwise fetch
      let usersList = users;
      if (users.length === 0) {
        const usersResponse = await fetch('https://movafit-booking-server.vercel.app/api/users/getAllUsers');
        const usersData = await usersResponse.json();
        usersList = usersData.users || [];
      }

      // Combine appointments with user data
      const appointmentsWithUsers = appointmentsList.map((apt: any) => {
        const user = usersList.find((u: User) => u._id === apt.userId);
        return {
          ...apt,
          user: user || null
        };
      });

      setAppointments(appointmentsWithUsers);
      return now; // Return timestamp for cache update
    } catch (error) {
      // Silent error handling
      return now;
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: 'completed' | 'cancelled',
    measurements: any,
    selectedUser: User | null
  ) => {
    try {
      // Update appointment status
      const appointmentResponse = await fetch(`https://movafit-booking-server.vercel.app/api/appointments/updateAppointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          ...(status === 'completed' && {
            measurements: {
              weight: measurements.weight ? parseFloat(measurements.weight) : undefined,
              chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
              waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
              hips: measurements.hips ? parseFloat(measurements.hips) : undefined,
            },
            caloriesBurnt: measurements.caloriesBurnt ? parseFloat(measurements.caloriesBurnt) : undefined,
            sessionNotes: measurements.notes
          })
        })
      });

      if (!appointmentResponse.ok) {
        throw new Error('Failed to update appointment');
      }

      // If completed, update user's weight and measurements
      if (status === 'completed' && selectedUser) {
        // Update user weight if provided
        if (measurements.weight) {
          const weightResponse = await fetch(`https://movafit-booking-server.vercel.app/api/users/updateUserWeight/${selectedUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ weight: parseFloat(measurements.weight) })
          });

          if (!weightResponse.ok) {
            // Weight update failed, but continue with other updates
          }
        }

        // Update user measurements if any are provided
        const hasMeasurements = measurements.chest || measurements.waist || measurements.hips;
        if (hasMeasurements) {
          const measurementsData = {
            chest: measurements.chest ? parseFloat(measurements.chest) : null,
            waist: measurements.waist ? parseFloat(measurements.waist) : null,
            hips: measurements.hips ? parseFloat(measurements.hips) : null
          };

          const measurementsResponse = await fetch(`https://movafit-booking-server.vercel.app/api/users/updateUserMeasurements/${selectedUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ measurements: measurementsData })
          });

          if (!measurementsResponse.ok) {
            // Measurements update failed, but continue
          }
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    appointments,
    appointmentsLoading,
    setAppointments,
    fetchAppointments,
    updateAppointmentStatus
  };
};
